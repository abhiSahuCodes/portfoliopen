const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth.js');
const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    const missing = [
      !CLOUDINARY_CLOUD_NAME && 'CLOUDINARY_CLOUD_NAME',
      !CLOUDINARY_API_KEY && 'CLOUDINARY_API_KEY',
      !CLOUDINARY_API_SECRET && 'CLOUDINARY_API_SECRET',
    ].filter(Boolean).join(', ');
    const err = new Error(`Cloudinary is not configured. Missing: ${missing}`);
    err.statusCode = 500;
    throw err;
  }
};

const router = express.Router();

// Multer memory storage keeps file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only JPG and PNG images are allowed'));
  }
});

// POST /api/upload/image - upload a single image file and return its URL
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    ensureCloudinaryConfigured();

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Convert buffer to data URI (base64)
    const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'portfoliopen',
      resource_type: 'image',
      // Keep it simple: no transformations by default
    });

    return res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    const status = err.statusCode || err.http_code || 500;
    const message = err.message || 'Upload failed';
    return res.status(status).json({ success: false, message });
  }
});

// Simple error handler for multer/fileFilter errors scoped to this router
router.use((err, req, res, next) => {
  if (err) {
    const status = err.statusCode || err.http_code || 400;
    return res.status(status).json({ success: false, message: err.message || 'Upload error' });
  }
  next();
});

module.exports = router;