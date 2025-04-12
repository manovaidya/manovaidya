import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import mongoose from 'mongoose'
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import User from '../models/User.js';
import { sendOrderEmails } from '../middleware/mail.js';

const router = express.Router();

// working
router.get('/get-all-orders', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const orders = await Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user').populate('orderItems.productId');
    console.log("orders", orders)
    // Get total count for pagination
    const total = await Order.countDocuments();

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message
    });
  }
});

// Working
router.post('/create-order', async (req, res) => {
  try {
    // Get the body data
    const { email, name, phone, bottle, day, user, orderItems, address, consent, saveInfo, payment_id, paymentMethod, billingAddress, totalAmount, shippingAmount, couponDiscount } = req.body;

    console.log("BODY:BODY:BODYBODY:BODY:BODY", req.body);

    if (!email || !name || !phone || !address || !paymentMethod || !totalAmount || !shippingAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    const shippingAddress = {
      fullName: name,
      addressLine1: address.houseNo,
      addressLine2: address.street,
      city: address.city,
      state: address.state,
      pinCode: address.pinCode,
      country: address.country,
      phone: phone
    };

    const updatedUser = await User.findByIdAndUpdate(user, { address: shippingAddress }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newOrder = new Order({
      user: user,
      orderItems,
      shippingAddress,
      paymentMethod,
      couponDiscount,
      billingAddress,
      payment_id,
      paymentResult: null,
      subtotal: totalAmount,
      taxAmount: 0,
      shippingAmount,
      discountAmount: 0,
      totalAmount,
      isPaid: paymentMethod === "COD" ? false : true,
      status: "pending",
      consentToReceiveOffers: consent,
      saveInformation: saveInfo,
    });

    const order = await newOrder.save();

    res.status(201).json({ success: true, order, });

    if (order) {
      sendOrderEmails({ customerName: name, email, phone, orderId: order._id, orderDate: order.createdAt, orderItems, totalAmount, paymentId: payment_id, couponDiscount, billingAddress, paymentMethod, address })
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// working
router.get('/get-order-by-id/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch order and populate the necessary fields
    const order = await Order.findById(id)
      .populate('user') // Populate the user field
      .populate('orderItems.productId');

    // If no order is found
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Respond with the order data
    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message,
    });
  }
});

// working
router.post('/order-delete', async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log('orderId:===', req.body)
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/get-order-by-user-id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('orders', req.params)
    const orders = await Order.find({ user: id })
      .populate('user') // Populate the user field
      .populate('orderItems.productId');

    console.log('orders', orders)
    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No orders found for this user' });
    }

    res.status(200).json({ success: true, orders });

  } catch (error) {
    console.error('Get orders by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get orders',
      error: error.message,
    });
  }
});


// working
router.post('/change-status/:id', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!orderStatus) {
      return res.status(400).json({ success: false, message: 'Order status is required' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = orderStatus;

    await order.save();

    return res.status(200).json({ success: true, message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});



export default router;