import express from 'express';
import Banner from '../models/Banner.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/banners");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ position: 1 });

    res.status(200).json({
      success: true,
      banners
    });
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banners',
      error: error.message
    });
  }
});


// Get banner by ID
router.get('/get-single-banner/:id', async (req, res) => {
  try {
    // console.log("hhhhhhhhhhhhh:==", req.params.id)
    const banner = await Banner.findById(req.params.id);
    // console.log("banner", banner)
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      banner
    });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get banner',
      error: error.message
    });
  }
});

// Create new banner (admin only)
router.post('/create-banners', upload.any('images'), async (req, res) => {
  try {
    // Destructure the data from the body
    const { name, type, link, startDate, endDate, position, isActive } = req.body;

    // Log request data for debugging
    console.log('Body', req.body);
    console.log('Files', req.files);

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    // Ensure that we are getting correct data, if it's single object rather than array
    const bannerData = [];
    if (Array.isArray(name)) {
      // If multiple banners are being created, process each banner
      if (name.length !== req.files.length || type.length !== req.files.length || isActive.length !== req.files.length) {
        return res.status(400).json({
          success: false,
          message: 'Mismatch between the number of images and the provided banner data',
        });
      }

      for (let i = 0; i < req.files.length; i++) {
        bannerData.push({
          name: name[i],
          type: type[i],
          images: [req.files[i].filename],
          link: link || '',
          startDate: startDate || null,
          endDate: endDate || null,
          position: position || 0,
          isActive: isActive[i] === 'true',
        });
      }
    } else {
      // If only one banner is being created, process the single set of data
      bannerData.push({
        name,
        type,
        images: [req.files[0].filename],
        link: link || '',
        startDate: startDate || null,
        endDate: endDate || null,
        position: position || 0,
        isActive: isActive === 'true',
      });
    }

    // Save the banner(s) to the database
    await Banner.insertMany(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banners created successfully',
      banners: bannerData,
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create banners',
      error: error.message,
    });
  }
});


// Update banner (admin only)

router.post('/update-banner/:id', upload.any('images'), async (req, res) => {
  try {
    const { name, type, link, oldImages, startDate, endDate, position, isActive } = req.body;

    console.log("BODYS", req.body);

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    let images = [];

    // If new images are uploaded, update the images array
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      images = [...newImages];
    }

    console.log("New images:", req.files);

    const updatedBannerData = {
      name: name || banner.name,
      type: type || banner.type,
      link: link || banner.link,
      images: images.length > 0 ? images : oldImages,
      startDate: startDate ? new Date(startDate) : banner.startDate,
      endDate: endDate ? new Date(endDate) : banner.endDate,
      position: position || banner.position,
      isActive: isActive !== undefined ? isActive === 'true' : banner.isActive,
    };

    // Update the banner with the new data
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updatedBannerData, { new: true });

    // Only delete old images if new images are uploaded
    if (req.files && req.files.length > 0 && oldImages) {
      console.log("Old images to delete:", oldImages);
      // oldImages?.forEach(oldImage => {
      const oldImagePath = `uploads/banners/${oldImages}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image
      }
      // });
    }

    res.status(200).json({ success: true, message: 'Banner updated successfully', banner: updatedBanner });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ success: false, message: 'Failed to update banner', error: error.message });
  }
});


// Delete banner (admin only)
router.get('/delete-banner/:id', async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    console.log("dara", banner?.images)

    if (banner?.images?.length > 0) {
      for (let i = 0; i < banner?.images?.length; i++) {
        if (fs.existsSync(`uploads/banners/${banner?.images[i]}`)) {
          fs.unlinkSync(`uploads/banners/${banner?.images[i]}`);
        }
      }
    }

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete banner',
      error: error.message
    });
  }
});



router.post('/change-status', async (req, res) => {
  const { bannerId, isActive } = req.body;

  try {
    const banner = await Banner.findById(bannerId);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    banner.isActive = isActive; // Update the status
    await banner.save();

    res.status(200).json({ success: true, message: 'Banner status updated successfully' });
  } catch (error) {
    console.error('Error updating Banner status:', error);
    res.status(500).json({ success: false, message: 'Failed to update Banner status' });
  }
});

export default router;