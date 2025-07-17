import express from 'express';
import User from '../models/User';
import { authMiddleware } from '../../server';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Get user profile
router.get('/profile', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, phone, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { name, email, phone, bio },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user password
router.put('/password', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Password update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user settings
router.put('/settings', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const { notifications, privacy } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { 
        notifications: notifications || undefined,
        privacy: privacy || undefined,
      },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ message: 'Settings updated successfully', user });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload avatar
router.post('/upload-avatar', authMiddleware, upload.single('image'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'avatars',
      width: 200,
      height: 200,
      crop: 'fill',
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    // Update user with new avatar URL
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ 
      message: 'Avatar uploaded successfully', 
      url: result.secure_url,
      user 
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return res.status(500).json({ message: 'Error uploading avatar' });
  }
});

// Correctly using ES module export
export default router;