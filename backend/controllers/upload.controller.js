const multer = require('multer');
const UploadService = require('../services/upload.service');

// Multer memory storage keeps file in memory buffer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error('Only JPG and PNG images are allowed'));
  },
});

// Lazy init service to ensure env vars are available
let _svc;
const getService = () => {
  if (!_svc) _svc = new UploadService();
  return _svc;
};

// POST /api/upload/image - upload a single image file and return its URL
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await getService().uploadImageBuffer(req.file.buffer, req.file.mimetype);

    return res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    const status = err.statusCode || err.http_code || 500;
    const message = err.message || 'Upload failed';
    return res.status(status).json({ success: false, message });
  }
};


module.exports = {
  upload, // multer middleware
  uploadImage,
};