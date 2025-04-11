import express from 'express';
import HealthTest from '../models/HealthTest.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all health tests
router.get('/', async (req, res) => {
  try {
    const { isActive } = req.query;
    
    // Build filter object
    const filter = {};
    
    // For regular users, only show active tests
    if (req.user && req.user.role === 'admin') {
      if (isActive !== undefined) {
        filter.isActive = isActive === 'true';
      }
    } else {
      filter.isActive = true;
    }
    
    const healthTests = await HealthTest.find(filter).sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      healthTests
    });
  } catch (error) {
    console.error('Get health tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health tests',
      error: error.message
    });
  }
});

// Get health test by ID
router.get('/:id', async (req, res) => {
  try {
    const healthTest = await HealthTest.findById(req.params.id)
      .populate('resultRanges.recommendedProducts', 'name images price finalPrice');
    
    if (!healthTest) {
      return res.status(404).json({
        success: false,
        message: 'Health test not found'
      });
    }
    
    res.status(200).json({
      success: true,
      healthTest
    });
  } catch (error) {
    console.error('Get health test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get health test',
      error: error.message
    });
  }
});

// Create new health test (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      questions,
      resultRanges,
      isActive
    } = req.body;
    
    // Parse questions and result ranges
    let parsedQuestions = [];
    let parsedResultRanges = [];
    
    try {
      parsedQuestions = JSON.parse(questions);
      parsedResultRanges = JSON.parse(resultRanges);
    } catch (e) {
      return res.status(400).json({
        success: false,
        message: 'Invalid questions or result ranges format'
      });
    }
    
    // Create new health test
    const healthTest = new HealthTest({
      name,
      description,
      questions: parsedQuestions,
      resultRanges: parsedResultRanges,
      isActive: isActive === 'true'
    });
    
    await healthTest.save();
    
    res.status(201).json({
      success: true,
      message: 'Health test created successfully',
      healthTest
    });
  } catch (error) {
    console.error('Create health test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create health test',
      error: error.message
    });
  }
});

// Update health test (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      questions,
      resultRanges,
      isActive
    } = req.body;
    
    // Find health test
    const healthTest = await HealthTest.findById(req.params.id);
    
    if (!healthTest) {
      return res.status(404).json({
        success: false,
        message: 'Health test not found'
      });
    }
    
    // Parse questions and result ranges if provided
    let parsedQuestions = healthTest.questions;
    let parsedResultRanges = healthTest.resultRanges;
    
    if (questions) {
      try {
        parsedQuestions = JSON.parse(questions);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid questions format'
        });
      }
    }
    
    if (resultRanges) {
      try {
        parsedResultRanges = JSON.parse(resultRanges);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid result ranges format'
        });
      }
    }
    
    // Update health test
    healthTest.name = name || healthTest.name;
    healthTest.description = description || healthTest.description;
    healthTest.questions = parsedQuestions;
    healthTest.resultRanges = parsedResultRanges;
    healthTest.isActive = isActive !== undefined ? isActive === 'true' : healthTest.isActive;
    
    await healthTest.save();
    
    res.status(200).json({
      success: true,
      message: 'Health test updated successfully',
      healthTest
    });
  } catch (error) {
    console.error('Update health test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update health test',
      error: error.message
    });
  }
});

// Delete health test (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const healthTest = await HealthTest.findById(req.params.id);
    
    if (!healthTest) {
      return res.status(404).json({
        success: false,
        message: 'Health test not found'
      });
    }
    
    await healthTest.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Health test deleted successfully'
    });
  } catch (error) {
    console.error('Delete health test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete health test',
      error: error.message
    });
  }
});

// Submit health test
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    
    // Find health test
    const healthTest = await HealthTest.findById(req.params.id)
      .populate('resultRanges.recommendedProducts', 'name images price finalPrice');
    
    if (!healthTest) {
      return res.status(404).json({
        success: false,
        message: 'Health test not found'
      });
    }
    
    // Calculate score
    let totalScore = 0;
    
    for (const answer of answers) {
      const question = healthTest.questions.find(q => q._id.toString() === answer.questionId);
      
      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Question not found: ${answer.questionId}`
        });
      }
      
      const option = question.options.find(o => o._id.toString() === answer.optionId);
      
      if (!option) {
        return res.status(400).json({
          success: false,
          message: `Option not found: ${answer.optionId}`
        });
      }
      
      totalScore += option.score;
    }
    
    // Determine result
    let result = null;
    
    for (const range of healthTest.resultRanges) {
      if (totalScore >= range.minScore && totalScore <= range.maxScore) {
        result = range;
        break;
      }
    }
    
    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Could not determine result'
      });
    }
    
    res.status(200).json({
      success: true,
      result: {
        score: totalScore,
        result: result.result,
        description: result.description,
        recommendedProducts: result.recommendedProducts
      }
    });
  } catch (error) {
    console.error('Submit health test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit health test',
      error: error.message
    });
  }
});

export default router;