import express from 'express';
import Herbs from '../models/Herbs.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { create } from 'domain';

const router = express.Router();

// Configure multer storage to save images with unique names
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/herbs'); // Save files in 'uploads/herbs' directory
    },
    filename: (req, file, cb) => {
        // Save the file with a unique UUID name and its original file extension
        cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    },
});

// Initialize multer with the defined storage settings
const upload = multer({ storage: storage });

router.post('/create-herbs', upload.any('herbsImage'), async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging request body
        console.log("Uploaded Files:", req.files); // Debugging uploaded files

        let herbsData = [];

        if (typeof req.body.herbs === 'string') {
            // console.log('GGGGGGGGG 1')
            // If it's a string (should be a JSON string), parse it
            try {
                herbsData = JSON.parse(req.body.herbs);
                if (!Array.isArray(herbsData)) {
                    // console.log('GGGGGGGGG 3')
                    herbsData = [herbsData];
                }
            } catch (error) {
                // console.log('GGGGGGGGG 4')
                return res.status(400).json({ error: 'Invalid JSON format for herbs data' });
            }
        } else if (Array.isArray(req.body.herbs)) {
            // console.log('GGGGGGGGG 5')
            herbsData = req.body.herbs.map((item) => JSON.parse(item));
        }

        console.log("Parsed Herbs Data:", herbsData); // Debugging parsed herbs data

        if (!herbsData.length) {
            return res.status(400).json({ error: 'No herbs data provided' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        if (herbsData.length !== req.files.length) {
            return res.status(400).json({ error: 'The number of uploaded files does not match the number of herbs' });
        }

        const imagePaths = req.files.map(file => file.filename);

        const newHerbs = await Herbs.create(
            herbsData.map((herb, index) => ({
                ...herb,
                images: [imagePaths[index]], // Attach the respective image for each herb
            }))
        );

        res.status(201).json({ status: true, message: 'Herbs created successfully', data: newHerbs });

    } catch (error) {
        console.error('Error creating herbs:', error);
        res.status(500).json({ error: 'An error occurred while creating herbs' });
    }
});


router.get('/get-all-herbs', async (req, res) => {
    try {
        const herbs = await Herbs.find().sort({ createdAt: -1 })

        if (!herbs || herbs.length === 0) {
            return res.status(404).json({ error: 'No herbs found' });
        }

        res.status(200).json({
            status: true,
            message: 'Herbs retrieved successfully',
            data: herbs,
        });
    } catch (error) {
        console.error('Error retrieving herbs:', error);
        res.status(500).json({ error: 'An error occurred while retrieving herbs' });
    }
});

router.get('/get-herbs-by-id/:id', async (req, res) => {
    const herbId = req.params.id;  // Get the herb ID from the URL parameter

    try {
        const herb = await Herbs.findById(herbId).sort({ createdAt: -1 });

        if (!herb) {
            return res.status(404).json({ error: 'Herb not found' });
        }

        res.status(200).json({ success: true, herb });
    } catch (error) {
        console.error('Error fetching herb:', error);
        res.status(500).json({ error: 'An error occurred while fetching the herb' });
    }
});

router.post('/update-herbs/:id', upload.any('herbsImage'), async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging request body
        console.log("Uploaded Files:", req.files);

        // Parse the 'herbs' field from the request body
        const data = JSON.parse(req.body.herbs);
        const { name, content } = data;

        // Check if files are uploaded
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `${file.filename}`); // or adjust depending on your file storage setup
        }

        // Find the existing herb record by ID
        const existingHerb = await Herbs.findById(req.params.id);
        if (!existingHerb) {
            return res.status(404).json({ error: 'Herb not found' });
        }

        const updatedData = {
            name,
            content,
            images: imageUrls.length > 0 ? imageUrls : existingHerb.images, // keep existing images if none are uploaded
        };

        const updatedHerbs = await Herbs.updateOne(
            { _id: req.params.id },
            { $set: updatedData }
        );

        if (updatedHerbs.nModified === 0) {
            return res.status(400).json({ error: 'No herbs were updated' });
        }

        res.status(200).json({
            status: true,
            message: 'Herb updated successfully',
            data: updatedHerbs,
        });

    } catch (error) {
        console.error('Error updating herb:', error);
        res.status(500).json({ error: 'An error occurred while updating herb' });
    }
});

router.post('/update-herbs-without-image/:id', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debugging request body
        console.log("Uploaded Files:", req.files);

        const data = JSON.parse(req.body.herbs);
        const { name, content } = data;
        const existingHerb = await Herbs.findById(req.params.id);
        if (!existingHerb) {
            return res.status(404).json({ error: 'Herb not found' });
        }

        const updatedData = {
            name,
            content,
        };

        const updatedHerbs = await Herbs.updateOne(
            { _id: req.params.id },
            { $set: updatedData }
        );

        if (updatedHerbs.nModified === 0) {
            return res.status(400).json({ error: 'No herbs were updated' });
        }

        res.status(200).json({
            status: true,
            message: 'Herb updated successfully',
            data: updatedHerbs,
        });

    } catch (error) {
        console.error('Error updating herb:', error);
        res.status(500).json({ error: 'An error occurred while updating herb' });
    }
});


router.get('/delete-herbs/:id', async (req, res) => {
    try {
        // Find and delete the herb record by ID
        const deletedHerb = await Herbs.findByIdAndDelete(req.params.id).sort({ createdAt: -1 });

        if (!deletedHerb) {
            return res.status(404).json({ error: 'Herb not found' });
        }

        res.status(200).json({ status: true, message: 'Herb deleted successfully', data: deletedHerb, });

    } catch (error) {
        console.error('Error deleting herb:', error);
        res.status(500).json({ error: 'An error occurred while deleting the herb' });
    }
});

router.get('/get-herbs-by-product-id/:id', async (req, res) => {
    try {
        // Find herbs with the specified productId
        const herbs = await Herbs.find({ productId: req.params.id });

        // If no herbs are found, return an error
        if (!herbs || herbs.length === 0) {
            return res.status(404).json({ error: 'No herbs found for the given productId' });
        }

        // Return the found herbs
        res.status(200).json({ status: true, message: 'Herbs retrieved successfully', data: herbs, });

    } catch (error) {
        console.error('Error retrieving herbs:', error);
        res.status(500).json({ error: 'An error occurred while retrieving herbs' });
    }
})

export default router;
