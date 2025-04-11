import express from 'express';
import Banner from '../models/Banner.js';
import Product from '../models/Product.js';
import Category from '../models/Categories.js';
import Blog from '../models/Blog.js';
import Disease from '../models/Disease.js';

const router = express.Router();

// Get home page data
router.get('/', async (req, res) => {
  try {
    // Get active banners for home page
    const banners = await Banner.find({ 
      type: 'home', 
      isActive: true,
      $or: [
        { startDate: { $exists: false } },
        { startDate: null },
        { startDate: { $lte: new Date() } }
      ],
      $and: [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: new Date() } }
          ]
        }
      ]
    }).sort({ position: 1 });
    
    // Get featured products (newest 8 products)
    const featuredProducts = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('name images price finalPrice discountPercentage ratings numReviews');
    
    // Get top rated products (highest rated 8 products)
    const topRatedProducts = await Product.find({ isActive: true, ratings: { $gt: 0 } })
      .sort({ ratings: -1 })
      .limit(8)
      .select('name images price finalPrice discountPercentage ratings numReviews');
    
    // Get categories
    const categories = await Category.find({ isActive: true })
      .sort({ position: 1 })
      .select('name image');
    
    // Get latest blogs
    const blogs = await Blog.find({ isActiveInHomepage: true })
      .sort({ date: -1 })
      .limit(3)
      .select('title heading image date')
      .populate('author', 'name');
    
    // Get diseases for mental health section
    const diseases = await Disease.find({ isActive: true })
      .sort({ name: 1 })
      .select('name image');
    
    res.status(200).json({
      success: true,
      homeData: {
        banners,
        featuredProducts,
        topRatedProducts,
        categories,
        blogs,
        diseases
      }
    });
  } catch (error) {
    console.error('Get home data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get home page data',
      error: error.message
    });
  }
});

export default router;