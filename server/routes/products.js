import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
// import { upload } from '../server.js';
// import upload from '../middleware/multer.js';
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Review from '../models/Reviews.js';
import { type } from 'os';
import Category from '../models/Categories.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');  // specify the folder to save images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Generate a unique filename
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.get('/all-product', async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, sort, search, disease, page = 1,

    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (disease) filter.diseases = disease;

    // Price range
    if (minPrice || maxPrice) {
      filter.finalPrice = {};
      if (minPrice) filter.finalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
    }

    // Search
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subDescription: { $regex: search, $options: 'i' } }
      ];
    }


    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOption = { finalPrice: 1 };
          break;
        case 'price_desc':
          sortOption = { finalPrice: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { ratings: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    } else {
      sortOption = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(filter).sort(sortOption)
      .populate('variant.tagType')
    // console.log("BODYS", products)
    // .populate('category', 'name')
    // .populate('subcategory', 'name')
    // .populate('colors', 'name code')
    // .populate('sizes', 'name')
    // .populate('tags', 'name')
    // .populate('diseases', 'name');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.status(200).json({ success: true, products, pagination: { total, } });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Failed to get products', error: error.message });
  }
});

router.get('/get_product_by_id/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('herbsId')
      .populate('variant.tagType')
    // .populate('subcategory', 'name')
    // .populate('colors', 'name code')
    // .populate('sizes', 'name')
    // .populate('tags', 'name')
    // .populate('diseases', 'name')
    // .populate({
    //   path: 'reviews.user',
    //   select: 'name profilePic'
    // });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message
    });
  }
});

router.post('/create-product', upload.fields([{ name: 'productImages', maxCount: 8 }, { name: 'blogImages', maxCount: 4 }]), async (req, res) => {
  try {
    const { productName, productSubDescription, productDescription, Variant, herbs, faqs, urls, RVUS, smirini, herbsId, } = req.body;
    console.log("BODY:-", req.body)
    // Parse JSON strings if they are provided as strings
    const parsedVariants = typeof Variant === 'string' ? JSON.parse(Variant) : Variant;
    const parsedHerbs = typeof herbs === 'string' ? JSON.parse(herbs) : herbs;
    const parsedFaqs = typeof faqs === 'string' ? JSON.parse(faqs) : faqs;
    const parsedUrls = typeof urls === 'string' ? JSON.parse(urls) : urls;
    const parsedRVUS = typeof RVUS === 'string' ? JSON.parse(RVUS) : RVUS;

    let parsedHerbsId = [];
    if (herbsId) {
      try {
        parsedHerbsId = JSON.parse(herbsId); // If it's valid JSON, parse it
      } catch (err) {
        console.error("Error parsing herbsId:", err);
      }
    }

    const productImages = req.files['productImages'] ? req.files['productImages'].map(file => file.filename) : [];
    const blogImages = req.files['blogImages'] ? req.files['blogImages'].map(file => file.filename) : [];

    // Construct the Variant array
    const variants = parsedVariants.map((v) => ({ price: parseFloat(v.price), discountPrice: parseFloat(v.discountPrice), finalPrice: parseFloat(v.finalPrice).toFixed(2), day: v.day, bottle: v.bottle, tex: v.tex, tagType: v.tagType }));

    // Construct the Herbs array and handle empty images gracefully
    const herbsArray = parsedHerbs || []; // Default to empty array if undefined

    // Construct the FAQ array
    const faqsArray = parsedFaqs.map((faq) => ({ question: faq.question, answer: faq.answer }));

    // Construct the URLs array
    const urlsArray = parsedUrls.map((url) => ({ url: url.url }));

    const RVUSArray = parsedRVUS.map((RVU) => ({ RVU: RVU.RVU }));

    // Create a new Product document
    const product = new Product({ productName, productSubDescription, productDescription, variant: variants, herbs: herbsArray, herbsId: parsedHerbsId, faqs: faqsArray, urls: urlsArray, RVUS: RVUSArray, smirini, productImages, blogImages });

    // Save the product to the database
    await product.save();

    // Send a success response
    res.status(201).json({ success: true, message: 'Product created successfully', product, });
  } catch (error) {
    // Log and return error if something fails
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product', error: error.message, });
  }
});

router.post('/update-product/:id', upload.fields([{ name: 'productImages', maxCount: 8 }, { name: 'blogImages', maxCount: 4 }]), async (req, res) => {
  try {
    const { productName, productSubDescription, productDescription, Variant, herbs, faqs, urls, RVUS, oldProductImage, oldBlogImage, herbsId, smirini } = req.body;

    const parseJson = (jsonString) => {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error("Invalid JSON string:", error);
        return [];
      }
    };

    const parsedVariants = Variant ? parseJson(Variant) : [];
    const parsedHerbs = herbs ? parseJson(herbs) : [];
    const parsedFaqs = faqs ? parseJson(faqs) : [];
    const parsedUrls = urls ? parseJson(urls) : [];
    const parsedRVUS = RVUS ? parseJson(RVUS) : [];
    // console.log("parsedHerbs bbbbbbbbbbbb", parsedVariants);

    let parsedHerbsId = [];
    if (herbsId) {
      parsedHerbsId = parseJson(herbsId);
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(200).json({ success: false, message: 'Product not found', });
    }

    // Handle uploaded product and blog images
    let productImages = [];
    if (req.files && req.files['productImages'] && req.files['productImages'].length > 0) {
      productImages = req.files['productImages'].map(file => file.filename);
    }

    let blogImages = [];
    if (req.files && req.files['blogImages'] && req.files['blogImages'].length > 0) {
      blogImages = req.files['blogImages'].map(file => file.filename);
    }

    // Construct the Variant array
    const variants = parsedVariants.map((v) => ({ price: parseFloat(v.price) || 0, discountPrice: parseFloat(v.discountPrice) || 0, finalPrice: parseFloat(v.finalPrice).toFixed(2) || '0.00', day: v.day || '', bottle: v.bottle || '', tex: v.tex || '0', tagType: v.tagType || '' }));

    const herbsArray = parsedHerbs || []; // Default to empty array if undefined

    const faqsArray = parsedFaqs.map((faq) => ({ question: faq.question, answer: faq.answer, }));

    const urlsArray = parsedUrls.map((url) => ({ url: url.url, }));
    const RVUSArray = parsedRVUS.map((RVU) => ({ RVU: RVU.RVU, }));

    // Handling product image deletions and updates
    let updatedProductImages = product.productImages || [];
    if (productImages.length > 0) {
      if (oldProductImage && !productImages.some(newImage => oldProductImage.includes(newImage))) {
        // console.log(`Deleting old product images: ${oldProductImage}`);
        oldProductImage.split(",").forEach(item => {
          const filePath = `uploads/products/${item.trim()}`;
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              // console.log(`Deleted old product image: ${item.trim()}`);
            }
          } catch (error) {
            console.error(`Error deleting old product image ${item.trim()}:`, error);
          }
        });
      }
      updatedProductImages = [...productImages];
    }

    // Handling blog image deletions and updates
    let updatedBlogImages = product.blogImages || [];
    if (blogImages.length > 0) {
      if (oldBlogImage && !blogImages.some(newImage => oldBlogImage.includes(newImage))) {
        // console.log(`Deleting old blog images: ${oldBlogImage}`);
        oldBlogImage.split(",").forEach(item => {
          const filePath = `uploads/products/${item.trim()}`;
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              // console.log(`Deleted old blog image: ${item.trim()}`);
            }
          } catch (error) {
            console.error(`Error deleting old blog image ${item.trim()}:`, error);
          }
        });
      }
      updatedBlogImages = [...blogImages];
    } else if (oldBlogImage) {
      // oldBlogImage.split(",").forEach(item => {
      //   const filePath = `uploads/products/${item.trim()}`;
      //   try {
      //     if (fs.existsSync(filePath)) {
      //       fs.unlinkSync(filePath);
      //       // console.log(`Deleted old blog image: ${item.trim()}`);
      //     }
      //   } catch (error) {
      //     console.error(`Error deleting old blog image ${item.trim()}:`, error);
      //   }
      // });
    }

    // Update the product object with the new values
    product.productName = productName ? productName : product.productName;
    product.smirini = smirini ? smirini : product.smirini;
    product.productSubDescription = productSubDescription ? productSubDescription : product.productSubDescription;
    product.productDescription = productDescription ? productDescription : product.productDescription;
    product.variant = variants.length > 0 ? variants : product.variant;
    product.herbsId = parsedHerbsId.length > 0 ? parsedHerbsId : product.herbsId;
    product.faqs = faqsArray.length > 0 ? faqsArray : product.faqs;
    product.urls = urlsArray.length > 0 ? urlsArray : product.urls;
    product.RVUS = RVUSArray.length > 0 ? RVUSArray : product.RVUS;
    product.productImages = updatedProductImages.length > 0 ? updatedProductImages : product.productImages;
    product.blogImages = updatedBlogImages.length > 0 ? updatedBlogImages : product.blogImages;

    // Save the updated product
    await product.save();

    res.status(200).json({ success: true, message: 'Product updated successfully', product, });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product', error: error.message, });
  }
});

router.get("/delete-product/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product has images and delete them from the file system
    if (product.productImages && product.productImages.length > 0) {
      // Loop through each image and delete it from the file system
      for (let i = 0; i < product.productImages.length; i++) {
        fs.unlinkSync(`uploads/products/${product.productImages[i]}`);
      }
    }

    // Delete the product from the database
    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product and associated images deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

router.post('/change-status', async (req, res) => {
  const { productId, isActive } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = isActive; // Update the status
    await product.save();

    res.status(200).json({ success: true, message: 'Product status updated successfully' });
  } catch (error) {
    console.error('Error updating Product status:', error);
    res.status(500).json({ success: false, message: 'Failed to update Product status' });
  }
});

router.post('/change-status-wellnessKits', async (req, res) => {
  const { productId, wellnessKits } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.wellnessKits = wellnessKits; // Update the status
    await product.save();

    res.status(200).json({ success: true, message: 'Product wellness Kits status updated successfully' });
  } catch (error) {
    console.error('Error updating Product status:', error);
    res.status(500).json({ success: false, message: 'Failed to update Product status' });
  }
});

// // Add product review

// router.post('/reviews', upload.single('profileImage'), async (req, res) => {
//   try {
//     const { name, rating, email, reviewText } = req.body;
//     console.log("CCCCCCCCCCCrrrrrrrr", req.body)
//     // const product = await Product.findById(req.params.id);

//     // if (!product) {
//     //   return res.status(404).json({
//     //     success: false,
//     //     message: 'Product not found'
//     //   });
//     // }

//     // // Check if user already reviewed
//     // const alreadyReviewed = product.reviews.find(
//     //   review => review.user.toString() === req.user.id
//     // );

//     // if (alreadyReviewed) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: 'You have already reviewed this product'
//     //   });
//     // }

//     // // Add review
//     // const review = {
//     //   user: req.user.id,
//     //   name: req.user.name,
//     //   rating: Number(rating),
//     //   comment
//     // };

//     // product.reviews.push(review);

//     // // Update product ratings
//     // product.numReviews = product.reviews.length;
//     // product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

//     // await product.save();

//     // res.status(201).json({
//     //   success: true,
//     //   message: 'Review added successfully',
//     //   review
//     // });
//   } catch (error) {
//     console.error('Add review error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to add review',
//       error: error.message
//     });
//   }
// });

// Fixing __dirname issue for ES modules
// 

router.post('/reviews', upload.single('profileImage'), async (req, res) => {
  try {
    console.log("CCCCCCCCCCCrrrrrrrr", req.body)
    const { name, rating, email, reviewText, productId } = req.body;
    const profileImage = req.file ? req.file.path : null; // Profile image file path

    const newReview = new Review({ name, rating, email, reviewText, profileImage, productId });

    await newReview.save();

    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
});

router.post('/without-image-reviews', async (req, res) => {
  try {
    console.log("without-image-reviews", req.body)
    const { name, rating, email, reviewText, productId } = req.body;

    const newReview = new Review({ name, rating, email, reviewText, productId });

    await newReview.save();

    res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Failed to add review', error: error.message });
  }
});


router.get("/get-all-reviews", async (req, res) => {
  try {
    const reviews = await (await Review.find()).reverse()

    if (!reviews || reviews.length === 0) {
      return res.status(204).json({ success: false, message: 'No reviews found' });
    }

    res.status(200).json({ success: true, message: 'Reviews fetched successfully', reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
});

router.post('/change-review-status', async (req, res) => {
  try {
    const { reviewId, status } = req.body; // Expecting reviewId and status in the request body

    // Validate that reviewId and status are provided
    if (!reviewId || typeof status === 'undefined') {
      return res.status(200).json({
        success: false,
        message: 'Review ID and status are required'
      });
    }

    // Find the review by ID
    const review = await Review.findById(reviewId);

    // If review not found, send an error response
    if (!review) {
      return res.status(204).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update the review status
    review.status = status;

    // Save the updated review
    await review.save();

    // Return success response
    res.status(200).json({ success: true, message: 'Review status updated successfully', review });

  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status',
      error: error.message
    });
  }
});

router.get("/delete-reviews/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return res.status(200).json({ success: false, message: 'Review ID is required' });
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.profileImage) {
      try {
        fs.unlinkSync(review.profileImage);
      } catch (error) {
        console.error("Error deleting the image:", error);
      }
    }

    res.status(200).json({ success: true, message: 'Review deleted successfully', review });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
  }
});


// router.get('/search-all-product', async (req, res) => {
//   const { search } = req.query;
//   console.log("searchTerm:", search);
//   try {
//     // Search matching categories
//     const matchingCategories = await Category.find({
//       name: { $regex: term, $options: 'i' }
//     }).select('_id');

//     const matchingCategoryIds = matchingCategories.map(cat => cat._id);
//     const searchConditions = [
//       { productName: { $regex: term, $options: 'i' } },
//       { type: { $regex: term, $options: 'i' } },
//       { price: { $regex: term, $options: 'i' } },
//     ];

//     if (!isNaN(term)) {
//       searchConditions.push({ price: Number(term) });
//     }

//     if (matchingCategoryIds.length > 0) {
//       searchConditions.push({ categoryId: { $in: matchingCategoryIds } });
//     }
//     const products = await Product.find({ $or: searchConditions }).populate("categoryId");
//     res.status(200).json({ success: true, message: 'Product Fetched Successfully', products })
//   } catch (error) {
//     console.error('Error deleting review:', error);
//     res.status(500).json({ success: false, message: 'Failed to delete review', error: error.message });
//   }
// })

router.get('/search-all-product', async (req, res) => {
  const { search } = req.query;
  console.log("searchTerm:", search);

  try {
    const searchRegex = new RegExp(search, 'i');

    // 1. Find matching category IDs (optional)
    const matchingCategories = await Category.find({
      name: { $regex: searchRegex }
    }).select('_id');
    const matchingCategoryIds = matchingCategories.map(cat => cat._id);

    // 2. Build dynamic search conditions
    const searchConditions = [
      { productName: searchRegex }, { smirini: searchRegex }, { productDescription: searchRegex },
      { productSubDescription: searchRegex }, { 'variant.day': searchRegex }, { 'variant.bottle': searchRegex },
      { 'variant.tex': searchRegex },
    ];

    // If numeric, search variant.price/finalPrice
    if (!isNaN(search)) {
      searchConditions.push({ 'variant.price': Number(search) });
      searchConditions.push({ 'variant.finalPrice': Number(search) });
    }

    // If matching categories found
    if (matchingCategoryIds.length > 0) {
      searchConditions.push({ categoryId: { $in: matchingCategoryIds } });
    }

    // 3. Perform product search
    const products = await Product.find({ $or: searchConditions }).sort({createdAt: -1});

    // 4. Send response
    res.status(200).json({ success: true, message: 'Products fetched successfully', products });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
});


export default router;