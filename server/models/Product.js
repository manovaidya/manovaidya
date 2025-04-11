import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  smirini: {
    type: String,
    required: true,
    trim: true
  },
  productSubDescription: {
    type: String,
    trim: true
  },
  productDescription: {
    type: String,
    required: true
  },
  variant: [{
    price: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number,
      required: true
    },
    finalPrice: {
      type: Number,
      required: true
    },
    day: {
      type: String, // Assuming the 'day' is a string (e.g., "30 Day")
      required: true
    },
    bottle: {
      type: String, // Assuming the 'bottle' is a string (e.g., "3 Bottle")
      required: true
    },
    tex: {
      type: String, // Assuming the 'tex' is a string (you can change this based on your use case)
      required: true
    }
  }],
  productImages: [{
    type: String, // Assuming the images are stored as URLs or file paths (strings)
    required: true
  }],
  blogImages: [{
    type: String, // Assuming the images are stored as URLs or file paths (strings)
  }],
  herbsId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Herbs',
    required: false,
    default: null
  }],
  faqs: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  }],
  urls: [{
    url: {
      type: String,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: false
  },
  wellnessKits: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
