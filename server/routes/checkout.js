import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get checkout information
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name images price finalPrice stock'
      })
      .populate('items.color', 'name code')
      .populate('items.size', 'name');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Get user's saved addresses
    const user = await User.findById(req.user.id).select('address');
    
    // Calculate taxes (for example, 18% GST)
    const taxRate = 0.18;
    const subtotal = cart.totalAmount;
    const taxAmount = subtotal * taxRate;
    
    // Calculate shipping (free for orders above ₹1000)
    const shippingAmount = subtotal > 1000 ? 0 : 100;
    
    // Apply coupon discount if any
    const discountAmount = cart.appliedCoupon ? cart.appliedCoupon.discount : 0;
    
    // Calculate total
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    
    res.status(200).json({
      success: true,
      checkout: {
        cart,
        addresses: user.address,
        summary: {
          subtotal,
          taxAmount,
          taxRate,
          shippingAmount,
          discountAmount,
          totalAmount
        }
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get checkout information',
      error: error.message
    });
  }
});

// Process checkout
router.post('/process', authenticateToken, async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      consentToReceiveOffers,
      saveInformation
    } = req.body;
    
    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name images price finalPrice stock'
      });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Check product availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product.name}`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`
        });
      }
    }
    
    // Calculate taxes (for example, 18% GST)
    const taxRate = 0.18;
    const subtotal = cart.totalAmount;
    const taxAmount = subtotal * taxRate;
    
    // Calculate shipping (free for orders above ₹1000)
    const shippingAmount = subtotal > 1000 ? 0 : 100;
    
    // Apply coupon discount if any
    const discountAmount = cart.appliedCoupon ? cart.appliedCoupon.discount : 0;
    
    // Calculate total
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;
    
    // Prepare order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images[0],
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    }));
    
    // Create order
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      status: paymentMethod === 'cod' ? 'processing' : 'pending',
      consentToReceiveOffers: consentToReceiveOffers || false,
      saveInformation: saveInformation || false
    });
    
    await order.save();
    
    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }
    
    // Save address to user profile if requested
    if (saveInformation) {
      const user = await User.findById(req.user.id);
      
      // Check if address already exists
      const addressExists = user.address.some(addr => 
        addr.addressLine1 === shippingAddress.addressLine1 &&
        addr.city === shippingAddress.city &&
        addr.pinCode === shippingAddress.pinCode
      );
      
      if (!addressExists) {
        user.address.push({
          ...shippingAddress,
          isDefault: user.address.length === 0 // Make default if first address
        });
        
        await user.save();
      }
    }
    
    // Clear cart
    await Cart.findOneAndDelete({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Checkout process error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process checkout',
      error: error.message
    });
  }
});

export default router;