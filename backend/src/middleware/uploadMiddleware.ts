import multer from 'multer';
import { Request } from 'express';

// Use memory storage so we can send buffer to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  // Mobile camera photos can be large (often 5-15MB+).
  // Increase limit to prevent silent failures on mobile.
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max per file
}).array('files', 10); // field name 'files', max 10 files
