import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  symptoms: [{
    type: String
  }],
  treatments: [{
    type: String
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Disease = mongoose.model('Disease', diseaseSchema);

export default Disease;