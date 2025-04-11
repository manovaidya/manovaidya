import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  // description: {
  //   type: String
  // },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // position: {
  //   type: Number,
  //   default: 0
  // }
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);

export default SubCategory;