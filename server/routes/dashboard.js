import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Categories.js';
import Banner from '../models/Banner.js';
import Blog from '../models/Blog.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments();
    
    // Total products
    const totalProducts = await Product.countDocuments();
    
    // Total users
    const totalUsers = await User.countDocuments();
    
    // Total categories
    const totalCategories = await Category.countDocuments();
    
    // Total banners
    const totalBanners = await Banner.countDocuments();
    
    // Total blogs
    const totalBlogs = await Blog.countDocuments();
    
    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    
    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name')
      .populate('orderItems.product', 'name');
    
    // Monthly sales
    const monthlyOrders = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate product details
    const populatedTopProducts = await Product.populate(topProducts, {
      path: '_id',
      select: 'name images'
    });
    
    // Format top products
    const formattedTopProducts = populatedTopProducts.map(item => ({
      product: item._id,
      totalSold: item.totalSold,
      revenue: item.revenue
    }));
    
    res.status(200).json({
      success: true,
      stats: {
        counts: {
          orders: totalOrders,
          products: totalProducts,
          users: totalUsers,
          categories: totalCategories,
          banners: totalBanners,
          blogs: totalBlogs
        },
        revenue: totalRevenue,
        ordersByStatus,
        recentOrders,
        monthlyOrders,
        topProducts: formattedTopProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
});

export default router;