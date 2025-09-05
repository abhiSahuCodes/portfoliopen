const express = require('express');
const { protect } = require('../middleware/auth.js');
const { upload, uploadImage } = require('../controllers/upload.controller');

const router = express.Router();

// Desc     -   Upload a single image to Cloudinary
// Route    -   POST /api/upload/image
// Access   -   Private
router.post('/image', protect, upload.single('image'), uploadImage);

// Simple error handler for multer/fileFilter errors scoped to this router
router.use((err, req, res, next) => {
  if (err) {
    const status = err.statusCode || err.http_code || 400;
    return res.status(status).json({ success: false, message: err.message || 'Upload error' });
  }
  next();
});

module.exports = router;