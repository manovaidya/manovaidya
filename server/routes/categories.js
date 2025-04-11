import express from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import Categorie from '../models/Categories.js';
import path from 'path';

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/categorys");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// Get all categories
router.get('/get-all-category', async (req, res) => {
  try {

    const categories = await Categorie.find({}).sort({ position: 1 });
    // console.log("categories", categories)
    // Respond with the list of categories
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error.message
    });
  }
});

// Get category by ID
router.get('/get-category-by-id/:id', async (req, res) => {
  try {
    const category = await Categorie?.findById(req.params.id).populate('productId');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get category',
      error: error.message
    });
  }
});

// Create new category (admin only)
router.post('/create-category', upload.single('categoryImage'), async (req, res) => {
  try {
    const { categoryName, description, shortDescription, categoryStatus, productId, faq, healthTestId } = req.body;

    console.log("CCCCC", req?.body);

    // Validate categoryName
    if (!categoryName || categoryName.trim() === '') {
      return res.status(200).json({
        success: false,
        message: 'Category name is required and cannot be empty'
      });
    }

    // Check if category already exists
    const existingCategory = await Categorie.findOne({ categoryName });
    if (existingCategory) {
      return res.status(200).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Process uploaded image (if any)
    const image = req.file ? `${req.file.filename}` : null;

    // Ensure categoryStatus is correctly parsed as a boolean
    const isActive = categoryStatus === 'true' || categoryStatus === 'True' || categoryStatus === true;

    // Handle productId (optional field, should be an array of ObjectIds)
    let productIds = [];
    if (productId) {
      try {
        // Ensure that productId is parsed as an array of ObjectIds
        productIds = JSON.parse(productId);

        // If productId is an empty string, reset it to an empty array
        if (productIds.length === 1 && productIds[0] === "") {
          productIds = [];
        }
      } catch (error) {
        return res.status(200).json({
          success: false,
          message: 'Invalid productId format'
        });
      }
    }

    // Create new category
    const category = new Categorie({
      categoryName,
      description,
      shortDescription,
      productId: productIds,  // Use the parsed ObjectId array
      image,
      faq,
      isActive,
      healthTestId: healthTestId
    });

    // Save the category to the database
    await category.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});


// Update category (admin only)
router.post('/update-category/:id', upload.single('categoryImage'), async (req, res) => {
  try {
    const { categoryName, description, shortDescription, oldImage, categoryStatus, productId, position } = req.body;
    console.log("CCCCC", req?.body);

    if (!categoryName || categoryName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required and cannot be empty'
      });
    }

    const category = await Categorie.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Handle image upload
    let image = category.image;
    if (req.file) {
      if (image !== oldImage) {
        const imagePath = `./uploads/categorys/${image}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.warn('Old image not found, skipping deletion:', imagePath);
        }
      }
      image = req.file.filename;
    }

    // Safely handle productId
    let parsedProductId = [];
    if (productId) {
      parsedProductId = productId.split(',').map((id) => id.trim()); // Convert string to array of IDs
    }

    // Update category fields
    category.categoryName = categoryName || category.categoryName;
    category.description = description || category.description;
    category.shortDescription = shortDescription || category.shortDescription;
    category.productId = parsedProductId || category.productId;
    category.image = image;
    category.position = position !== undefined ? position : category.position;
    category.isActive = categoryStatus === 'true' || categoryStatus === true ? true : false;

    // Save the updated category
    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});




// Delete category (admin only)
router.get('/delete-category/:id', async (req, res) => {
  try {
    // Find the category by ID
    const category = await Categorie.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Delete the image file if it exists
    if (category.image) {
      const imagePath = `./uploads/categorys/${category.image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete the image file
      }
    }

    // Delete the category from the database
    await Categorie.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});


router.post('/change-status', async (req, res) => {
  const { categoryId, isActive } = req.body;

  try {
    const category = await Categorie.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.isActive = isActive; // Update the status
    await category.save();

    res.status(200).json({ success: true, message: 'Category status updated successfully' });
  } catch (error) {
    console.error('Error updating category status:', error);
    res.status(500).json({ success: false, message: 'Failed to update category status' });
  }
});

export default router;
