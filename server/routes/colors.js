import express from 'express';
import Color from '../models/Color.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all colors
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    
    // Build filter object
    const filter = {};
    
    // For regular users, only show active colors
    if (req.user && req.user.role === 'admin') {
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
    } else {
      filter.isActive = true;
    }
    
    const colors = await Color.find(filter).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      colors
    });
  } catch (error) {
    console.error('Get colors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get colors',
      error: error.message
    });
  }
});

// Get color by ID
router.get('/:id', async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }
    
    res.status(200).json({
      success: true,
      color
    });
  } catch (error) {
    console.error('Get color error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get color',
      error: error.message
    });
  }
});

// Create new color (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, code, isActive } = req.body;
    
    // Check if color already exists
    const existingColor = await Color.findOne({ name });
    if (existingColor) {
      return res.status(400).json({
        success: false,
        message: 'Color with this name already exists'
      });
    }
    
    // Create new color
    const color = new Color({
      name,
      code,
      isActive: isActive === 'true'
    });
    
    await color.save();
    
    res.status(201).json({
      success: true,
      message: 'Color created successfully',
      color
    });
  } catch (error) {
    console.error('Create color error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create color',
      error: error.message
    });
  }
});

// Update color (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, code, isActive } = req.body;
    
    // Find color
    const color = await Color.findById(req.params.id);
    
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }
    
    // Check if name is being changed and already exists
    if (name && name !== color.name) {
      const existingColor = await Color.findOne({ name });
      if (existingColor) {
        return res.status(400).json({
          success: false,
          message: 'Color with this name already exists'
        });
      }
    }
    
    // Update color
    color.name = name || color.name;
    color.code = code || color.code;
    color.isActive = isActive !== undefined ? isActive === 'true' : color.isActive;
    
    await color.save();
    
    res.status(200).json({
      success: true,
      message: 'Color updated successfully',
      color
    });
  } catch (error) {
    console.error('Update color error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update color',
      error: error.message
    });
  }
});

// Delete color (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    
    if (!color) {
      return res.status(404).json({
        success: false,
        message: 'Color not found'
      });
    }
    
    await color.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Color deleted successfully'
    });
  } catch (error) {
    console.error('Delete color error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete color',
      error: error.message
    });
  }
});

export default router;