
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    price: {
      type: Number,
      required: true
    },

    quantity: {
      type: String,
      required: true,
      default: 1
    },
    day: {
      type: String,
      // required: true,
      // default: 1
    },
    bottle: {
      type: String,
      // required: true,
      // default: 1
    },
  }],
  billingAddress: {
    type: String,
    // required: true
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: {
      type: String
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  gst:{
    type: String,
    trim: true,
  },
  couponDiscount: {
    type: String,
    trim: true,
    default: 0
  },
  payment_id: {
    type: String,
    default: 'Cash'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['COD', 'Online', 'Wallet']
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
  shippingAmount: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  sentToShipRocket: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'orderConfirmed'],
    default: 'pending'
  },
  trackingNumber: String,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  notes: String,
  consentToReceiveOffers: {
    type: Boolean,
    default: false
  },
  saveInformation: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;