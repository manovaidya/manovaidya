import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user cart
router.get('/get-cart/:id', async (req, res) => {
  try {
    const { id } = req.params;  // This line is updated to correctly destructure the id

    let cart = await Cart.findOne({ user: id }).populate('items.product').populate('user');
    console.log("cart", cart)
    if (!cart) {
      cart = new Cart({
        user: id,  // Ensure that the user ID is set correctly here
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }

    // Filter out items with deleted products or out of stock
    cart.items = cart.items.filter(item => item.product.variant.filter(variant => variant?.finalPrice === item?.price));
    // console.log("XXXX", cart.items)


    res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity, item } = req.body;

    // console.log("req.body", req.body);

    // Validate the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Parse the item data (item is a stringified JSON)
    const variant = JSON.parse(item);

    // Ensure the variant data is correct (you can perform additional checks if necessary)
    if (!variant || !variant._id || !variant.finalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Invalid variant data'
      });
    }

    // Find or create the cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalAmount: 0
      });
    }

    // Check if the item already exists in the cart (by comparing productId and variant._id)
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.price === variant.finalPrice // Assuming price here is the finalPrice
    );

    if (existingItemIndex > -1) {
      // Update the quantity if the item already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add the new item to the cart
      cart.items.push({
        product: productId,
        quantity,
        price: variant.finalPrice,
        status: "pending"
      });
    }

    // Recalculate the total amount for the cart
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Save the updated cart
    await cart.save();

    // Populate product details in the cart response (only necessary fields)
    await cart.populate({
      path: 'items.product',
      select: 'name images price finalPrice stock'
    });

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
});


// Update cart item quantity
router.post('/update', async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;  // Get the userId, itemId, and quantity from the request body

    // console.log("Request Body: ", req.body);

    // Find cart based on userId
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check the product stock to ensure it's available in sufficient quantity
    const product = await Product.findById(cart.items[itemIndex].product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if there's enough stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock. Available: ${product.stock}`
      });
    }

    // Update the quantity of the item in the cart
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].status = "pending";

    // Recalculate the total amount of the cart
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Save the updated cart
    await cart.save();

    await cart.populate('items.product');

    // Return the updated cart response
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: error.message
    });
  }
});

// Remove item from cart
router.post('/delete-from-cart', async (req, res) => {
  try {
    const { itemId, userId } = req.body;
    // console.log("itemId, userId:====", itemId, userId)
    // Find the cart associated with the user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    // Save the updated cart
    await cart.save();

    // Populate product details
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
});


router.post('/delete-cart/:id', async (req, res) => {
  try {
    const { id } = req.params; // The ID passed in the URL (cart ID)

    // Find the user's cart and update the status of the items in the cart
    const cart = await Cart.findOneAndDelete({ _id: id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('Remove cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update the cart',
      error: error.message
    });
  }
});


// Apply coupon to cart
router.post('/apply-coupon', authenticateToken, async (req, res) => {
  try {
    const { couponCode } = req.body;

    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // In a real application, you would validate the coupon code against a database
    // For this example, we'll use a hardcoded coupon

    if (couponCode === 'VAIDYA001') {
      // Apply 10% discount
      const discount = cart.totalAmount * 0.1;

      cart.appliedCoupon = {
        code: couponCode,
        discount
      };

      await cart.save();

      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        cart
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply coupon',
      error: error.message
    });
  }
});

export default router;