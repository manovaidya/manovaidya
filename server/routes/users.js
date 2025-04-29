import express from 'express';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import bcrypt from 'bcryptjs'
import ShortUniqueId from "short-unique-id"
import { sendOtpPartnerSignUp, sendResetPassword } from '../middleware/mail.js';
import jwt from 'jsonwebtoken'

import { authenticateToken, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import sendToken from '../middleware/jwtToken.js';


const router = express.Router();

// Update user profile
router.put('/profile', authenticateToken, upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, mobile } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Process uploaded profile picture
    let profilePic = user.profilePic;
    if (req.file) {
      profilePic = `/uploads/${req.file.filename}`;
    }

    // Update user
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.profilePic = profilePic;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Add address
router.post('/address', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      phone,
      isDefault
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create new address
    const newAddress = {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      phone,
      isDefault: isDefault === 'true'
    };

    // If new address is default, update other addresses
    if (newAddress.isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add address
    user.address.push(newAddress);

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: newAddress
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: error.message
    });
  }
});

// Update address
router.put('/address/:addressId', authenticateToken, async (req, res) => {
  try {
    const {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      pinCode,
      country,
      phone,
      isDefault
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find address
    const addressIndex = user.address.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If new address is default, update other addresses
    if (isDefault === 'true') {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update address
    user.address[addressIndex] = {
      _id: user.address[addressIndex]._id,
      fullName: fullName || user.address[addressIndex].fullName,
      addressLine1: addressLine1 || user.address[addressIndex].addressLine1,
      addressLine2: addressLine2 || user.address[addressIndex].addressLine2,
      city: city || user.address[addressIndex].city,
      state: state || user.address[addressIndex].state,
      pinCode: pinCode || user.address[addressIndex].pinCode,
      country: country || user.address[addressIndex].country,
      phone: phone || user.address[addressIndex].phone,
      isDefault: isDefault === 'true'
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: user.address[addressIndex]
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: error.message
    });
  }
});

// Delete address
router.delete('/address/:addressId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find address
    const addressIndex = user.address.findIndex(
      addr => addr._id.toString() === req.params.addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Check if it's the only address
    if (user.address.length === 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the only address'
      });
    }

    // Check if it's the default address
    const isDefault = user.address[addressIndex].isDefault;

    // Remove address
    user.address.splice(addressIndex, 1);

    // If deleted address was default, set a new default
    if (isDefault && user.address.length > 0) {
      user.address[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: error.message
    });
  }
});

// Update user (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, mobile, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile = mobile || user.mobile;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive === 'true' : user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get-by-user-id/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user', error: error.message });
  }
});


router.get('/get-all-user', async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 }).select('-password');

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true, users, pagination: { total, }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users', error: error.message });
  }
});

router.post('/send-otp-for-user-signup', async (req, res) => {
  try {
    const { email } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(200).json({ status: false, message: "Email Already exists" });
    }

    const uniqueNumId = new ShortUniqueId({ length: 6, dictionary: "number" });
    const currentUniqueId = uniqueNumId.rnd();

    await Otp.create({
      email: email, // Saving the email associated with the OTP
      otp: currentUniqueId,
      otpExpiry: new Date(Date.now() + 20 * 60 * 1000), // OTP expiry is 20 minutes from now
    });

    await sendOtpPartnerSignUp({ email, otp: currentUniqueId });

    res.status(200).json({ success: true, message: 'OTP Sent Successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

router.post('/verify-otp-for-user-signup', async (req, res) => {
  try {
    console.log("DDDDDDD", req.body)
    const { fullName, mobile, email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(200).json({ status: false, message: "All fields are required" });
    }

    const otpMatch = await Otp.findOne({ email: email, otp: otp });

    if (!otpMatch) {
      return res.status(200).json({ status: false, message: "Invalid OTP" });
    }

    if (otpMatch.otpExpiry < Date.now()) {
      await Otp.deleteMany({ email: email });  // Clean up expired OTPs
      return res.status(400).json({ status: false, message: "OTP Expired" });
    }

    await Otp.deleteMany({ email: email });

    const uniqueNumId = new ShortUniqueId({ length: 6, dictionary: "number" });
    const currentUniqueId = uniqueNumId.rnd();
    let uniqueUserId = `U${currentUniqueId}`;

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name: fullName, email, phone: mobile, password: hash, uniqueUserId, });

    sendToken(newUser, 200, res, "User Created Successfully");

  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
  }
});

router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json({ status: false, message: "User Not Found" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(200).json({ status: false, message: "Incorrect Password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Use your secret key from environment
      { expiresIn: process.env.JWT_EXPIRES } // Set expiration time
    );

    res.status(200).json({
      status: true,
      message: "User Logged In Successfully",
      token,
      user // Send the token to the client
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

router.post('/send-reset-password-email', async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("Email:", email);
    if (!email) {
      return res.status(401).json({ status: false, message: "Email is required" });
    }
    console.log("Email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: false, message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const mailData = {
      email: email,
      token: token,
      user: user,
    };

    await sendResetPassword(mailData);
    res.status(200).json({ status: true, message: "Reset password email sent successfully" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res, next) => {
  try {
    // Destructure the token and new_password from the request body
    const { token, new_password } = req.body;
    console.log("TOKEN:", token, new_password);  // Logging token and password for debugging

    if (!token) {
      return res.status(400).json({ status: false, message: "No token found" });
    }

    // Check if the secret is loaded correctly
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ status: false, message: "JWT secret is not defined in the environment" });
    }

    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ status: false, message: "Token is not valid" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ status: false, message: "User not found" });
    }

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;

    // Save the updated password
    await user.save();
    return res.status(200).json({ status: true, message: "User password changed successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
});

router.get('/delete-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // if (user._id.toString() === req.user.id) {
    //   return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    // }

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: error.message });
  }
});


export default router;