const { v2: cloudinary } = require('cloudinary');

class UploadService {
  constructor() {
    this._configured = false;
    this.configure();
  }

  configure() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      // Do not throw here to allow the app to boot; throw when used
      this._configured = false;
      return;
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    this._configured = true;
  }

  ensureConfigured() {
    if (!this._configured) {
      this.configure();
    }

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
  }

  // Upload a buffer to Cloudinary, returns the Cloudinary upload result
  async uploadImageBuffer(buffer, mimetype, options = {}) {
    this.ensureConfigured();

    if (!buffer || !mimetype) {
      const err = new Error('Invalid image input');
      err.statusCode = 400;
      throw err;
    }

    // Convert buffer to data URI (base64)
    const base64 = `data:${mimetype};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'portfoliopen',
      resource_type: 'image',
      ...options,
    });

    return result;
  }
}

module.exports = UploadService;