import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  couponTitle: { type: String, required: true, unique: true },
  status: { type: Boolean, default: false, trim: true }, // Fixed status to be a boolean
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

export const Coupon = mongoose.model("Coupon", couponSchema);
