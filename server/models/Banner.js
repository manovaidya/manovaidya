import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['home', 'category', 'product', 'offer', 'promotion', 'Desktop', 'Mobile','Both']
  },
  images: [{
    type: String,
    required: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  // link: {
  //   type: String
  // },
  // startDate: {
  //   type: Date
  // },
  // endDate: {
  //   type: Date
  // },
  // position: {
  //   type: Number,
  //   default: 0
  // }
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
  
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;