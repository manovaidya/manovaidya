import express from 'express';
import SubCategory from '../models/SubCategory.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/subcategorys");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

// Get all subcategories
router.get('/get-all-sub-diseases', async (req, res) => {
  try {
    const subcategories = await SubCategory.find({}).sort({ position: 1 }).populate('productId');
    console.log("BODY", subcategories);
    res.status(200).json({
      success: true,
      subcategories
    });
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subcategories',
      error: error.message
    });
  }
});

// // Get subcategory by ID
router.get('/get-subcategory-by-id/:id', async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('productId');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      subcategory
    });
  } catch (error) {
    console.error('Get subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subcategory',
      error: error.message
    });
  }
});

// Create new subcategory (admin only)
router.post('/create-sub-diseases', upload.single('image'), async (req, res) => {
  try {
    const { name, productId, isActive } = req.body;
    console.log("BODY", req?.body)
    // Process uploaded image
    const image = req.file ? req.file.filename : null;

    // Create new subcategory
    const subcategory = new SubCategory({
      name,
      productId,
      image,
      // position: position || 0,
      isActive: isActive !== undefined ? isActive === 'true' : 'false'
    });

    await subcategory.save();

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      subcategory
    });
  } catch (error) {
    console.error('Create subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message
    });
  }
});

// Update subcategory (admin only)
router.post('/update-subcategory/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, productId, isActive } = req.body;

    // Find subcategory
    const subcategory = await SubCategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Process uploaded image
    let image = subcategory.image;
    if (req.file) { image = req.file.filename; }

    // Ensure isActive is properly converted to a boolean value
    subcategory.name = name || subcategory.name;
    subcategory.image = image;
    subcategory.productId = productId || subcategory.productId;
    subcategory.isActive = isActive !== undefined ? (isActive === 'true') : subcategory.isActive;

    await subcategory.save();

    res.status(200).json({
      success: true,
      message: 'Subcategory updated successfully',
      subcategory
    });
  } catch (error) {
    console.error('Update subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error.message
    });
  }
});

// Delete subcategory (admin only)
router.get('/delete-sub-disease/:id', async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }

    // Check if there is an image and if the file exists, then delete it
    if (subcategory.image) {
      const imagePath = path.join(`uploads/subcategorys/${subcategory.image}`);

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, delete it
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting image:', unlinkErr);
            } else {
              console.log('Image deleted successfully');
            }
          });
        } else {
          console.log('Image not found, skipping deletion');
        }
      });
    }

    // Delete the subcategory from the database
    await subcategory.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      error: error.message
    });
  }
});


router.post('/change-status', async (req, res) => {
  const { diseaseId, isActive } = req.body;

  try {
    const subcategory = await SubCategory.findById(diseaseId);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: 'disease not found' });
    }

    subcategory.isActive = isActive; // Update the status
    await subcategory.save();

    res.status(200).json({ success: true, message: 'disease status updated successfully' });
  } catch (error) {
    console.error('Error updating disease status:', error);
    res.status(500).json({ success: false, message: 'Failed to update disease status' });
  }
});
export default router;