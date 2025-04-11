import express from 'express';
import { Coupon } from '../models/Coupon.js';

const router = express.Router();

// Get all categories
router.get('/get-All-coupons', async (req, res) => {
    try {
        const coupons = await Coupon.find();
        console.log(coupons)
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/get-coupon-by-id/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findOne({ _id: id });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Coupon not found" });
        }

        res.status(200).json({ success: true, coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});



router.post('/create-coupon', async (req, res) => {
    try {
        const { couponCode, discount, couponTitle } = req.body;
        console.log(couponCode, discount, couponTitle)
        // Check if the coupon already exists
        const existingCoupon = await Coupon.findOne({ couponCode });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: "Coupon code already exists." });
        }

        const newCoupon = new Coupon({ couponCode, discount, couponTitle });
        await newCoupon.save();

        res.status(201).json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/update-coupon/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { discount, couponCode,couponTitle } = req.body;

        if (!couponCode || typeof couponCode !== 'string') {
            return res.status(400).json({ message: "Invalid coupon code." });
        }

        if (discount == null || isNaN(discount) || discount < 0) {
            return res.status(400).json({ message: "Invalid discount value." });
        }

        const updatedCoupon = await Coupon.findOneAndUpdate(
            { _id: id },
            { discount, couponCode,couponTitle, updatedAt: Date.now() },
            { new: true } // Return the updated document
        );

        if (!updatedCoupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, message: "Coupon updated successfully", coupon: updatedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// Delete category (admin only)
router.get('/delete-coupon/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCoupon = await Coupon.findOneAndDelete({ _id: id });
        if (!deletedCoupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, message: "Coupon deleted successfully", coupon: deletedCoupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/get-coupon-by-code', async (req, res) => {
    try {
        const { couponCode } = req.body
        console.log("couponCode", req.body.couponCode)
        const coupon = await Coupon.findOne({ couponCode });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

router.post('/change-status', async (req, res) => {
    const { couponId, status } = req.body

    try {
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }
        coupon.status = status;
        await coupon.save();

        res.status(200).json({ success: true, message: "Coupon status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/get-coupon-by-status', async (req, res) => {
    try {
        const { status } = req.body
        const coupons = await Coupon.find({ status: status });
        if (!coupons) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        res.status(200).json({ success: true, coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})
export default router;
