import express from 'express';
import Disease from '../models/Disease.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
// import { upload } from '../server.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Get all diseases
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    
    // Build filter object
    const filter = {};
    
    // For regular users, only show active diseases
    if (req.user && req.user.role === 'admin') {
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
    } else {
      filter.isActive = true;
    }
    
    const diseases = await Disease.find(filter)
      .sort({ name: 1 })
      .populate('relatedProducts', 'name images price finalPrice');
    
    res.status(200).json({
      success: true,
      diseases
    });
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get diseases',
      error: error.message
    });
  }
});

// Get disease by ID
router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id)
      .populate('relatedProducts', 'name images price finalPrice description');
    
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }
    
    res.status(200).json({
      success: true,
      disease
    });
  } catch (error) {
    console.error('Get disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get disease',
      error: error.message
    });
  }
});

// Create new disease (admin only)
router.post('/', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      symptoms,
      treatments,
      relatedProducts,
      isActive
    } = req.body;
    
    // Process uploaded image
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Create new disease
    const disease = new Disease({
      name,
      description,
      image,
      symptoms: symptoms ? symptoms.split(',').map(s => s.trim()) : [],
      treatments: treatments ? treatments.split(',').map(t => t.trim()) : [],
      relatedProducts: relatedProducts ? relatedProducts.split(',') : [],
      isActive: isActive === 'true'
    });
    
    await disease.save();
    
    res.status(201).json({
      success: true,
      message: 'Disease created successfully',
      disease
    });
  } catch (error) {
    console.error('Create disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create disease',
      error: error.message
    });
  }
});

// Update disease (admin only)
router.put('/:id', authenticateToken, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name,
      description,
      symptoms,
      treatments,
      relatedProducts,
      isActive
    } = req.body;
    
    // Find disease
    const disease = await Disease.findById(req.params.id);
    
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }
    
    // Process uploaded image
    let image = disease.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    
    // Update disease
    disease.name = name || disease.name;
    disease.description = description || disease.description;
    disease.image = image;
    disease.symptoms = symptoms ? symptoms.split(',').map(s => s.trim()) : disease.symptoms;
    disease.treatments = treatments ? treatments.split(',').map(t => t.trim()) : disease.treatments;
    disease.relatedProducts = relatedProducts ? relatedProducts.split(',') : disease.relatedProducts;
    disease.isActive = isActive !== undefined ? isActive === 'true' : disease.isActive;
    
    await disease.save();
    
    res.status(200).json({
      success: true,
      message: 'Disease updated successfully',
      disease
    });
  } catch (error) {
    console.error('Update disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update disease',
      error: error.message
    });
  }
});

// Delete disease (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }
    
    await disease.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Disease deleted successfully'
    });
  } catch (error) {
    console.error('Delete disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete disease',
      error: error.message
    });
  }
});

export default router;