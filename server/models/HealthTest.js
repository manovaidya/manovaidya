import mongoose from 'mongoose';

const healthTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      score: {
        type: Number,
        required: true
      }
    }]
  }],
  resultRanges: [{
    minScore: {
      type: Number,
      required: true
    },
    maxScore: {
      type: Number,
      required: true
    },
    result: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    recommendedProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const HealthTest = mongoose.model('HealthTest', healthTestSchema);

export default HealthTest;