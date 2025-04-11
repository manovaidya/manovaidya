import mongoose from 'mongoose';

const categorieSchema = new mongoose.Schema({
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    // required: true,
    default: null,
    trim: true
  }],
  healthTestId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AddHealthTest',
    default: null,
    trim: true
  },
  categoryName: {
    type: String,
    required: true,
    unique: true // Ensures uniqueness for categoryName
  },
  description: {
    type: String
  },
  shortDescription: {
    type: String
  },
  faq: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

const Categorie = mongoose.model('Categorie', categorieSchema);

export default Categorie;