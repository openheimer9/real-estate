import express from 'express';
import Property from '../models/Property';
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

// Create property
router.post('/create', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    // Now TypeScript knows that req.user exists and has userId
    const propertyData = {
      ...req.body,
      owner: req.user?.userId
    };
    
    // Validate the data against your model
    const property = new Property(propertyData);
    await property.save();
    
    return res.status(201).json({ 
      message: 'Property created successfully', 
      property 
    });
  } catch (error: any) {
    console.error('Property creation error:', error);
    return res.status(500).json({ 
      message: 'Error creating property',
      error: error.message
    });
  }
});

// Upload property image
router.post('/upload-image', authMiddleware, upload.single('image'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'properties',
      width: 1200,
      height: 800,
      crop: 'fill',
    });

    // Remove temp file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({ 
      message: 'Image uploaded successfully', 
      url: result.secure_url
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return res.status(500).json({ message: 'Error uploading image' });
  }
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email avatar');
    return res.status(200).json({ properties });
  } catch (error: any) {
    console.error('Property fetch error:', error);
    return res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email avatar');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    return res.status(200).json({ property });
  } catch (error: any) {
    console.error('Property fetch error:', error);
    return res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
});

// Get user's properties
router.get('/user/listings', authMiddleware, async (req: express.Request, res: express.Response) => {
  try {
    const properties = await Property.find({ owner: req.user?.userId });
    return res.status(200).json({ properties });
  } catch (error: any) {
    console.error('Property fetch error:', error);
    return res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// Replace module.exports = router; with:
export default router;