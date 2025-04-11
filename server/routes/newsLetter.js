import express from 'express';
import NewsLetter from '../models/NewsLetter.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/get-all-newsLetter', async (req, res) => {
    try {
        const newsletters = await NewsLetter.find();

        if (!newsletters || newsletters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No newsletters found.',
            });
        }

        res.status(200).json({
            success: true,
            newsletters,
        });
    } catch (error) {
        console.error('Error fetching newsletters:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch newsletters.',
            error: error.message,
        });
    }
});

router.post('/create-newsletter', async (req, res) => {
    const { name, email, phone } = req.body;

    console.log("gg", req.body)

    if (!name || !email || !phone) {
        return res.status(200).json({ error: 'All fields are required' });
    }

    try {
        // Check if the email already exists
        const existingSubscriber = await NewsLetter.findOne({ email });
        if (existingSubscriber) {
            return res.status(200).json({ success: false, error: 'This email is already subscribed' });
        }

        const existingphone = await NewsLetter.findOne({ phone });
        if (existingphone) {
            return res.status(200).json({ success: false, error: 'This Phone Number is already subscribed' });
        }

        // Create a new Newsletter subscription
        const newSubscription = new NewsLetter({
            name,
            email,
            phone,
        });

        // Save the subscription to the database
        await newSubscription.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: 'Subscription successful',
            subscription: newSubscription,
        });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/delete-newsletter/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedNewsletter = await NewsLetter.findByIdAndDelete(id);

        if (!deletedNewsletter) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found.',
            });
        }

        const newsletters = await NewsLetter.find();

        res.status(200).json({
            success: true,
            message: 'Newsletter deleted successfully.',
            newsletters, // Returning the updated list of newsletters
        });
    } catch (error) {
        console.error('Error deleting newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete newsletter.',
            error: error.message,
        });
    }
});



export default router;