import { Request, Response, NextFunction } from 'express';
import { cloudinary } from '../config/cloudinary';

interface CloudinaryUploadResult {
  secure_url?: string;
}

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const files = (req as Request & { files?: Express.Multer.File[] })?.files;
      if (!files || !Array.isArray(files) || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      if (!cloudName || !apiKey || !apiSecret) {
        return res.status(500).json({
          error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env',
        });
      }

      const urls: string[] = [];
      for (const file of files) {
        if (!file.mimetype?.startsWith('image/') || !file.buffer) {
          continue;
        }
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await new Promise<CloudinaryUploadResult | undefined>((resolve, reject) => {
          cloudinary.uploader.upload(
            dataUri,
            {
              folder: 'rsmeters/products',
              resource_type: 'image',
            },
            (err: Error | undefined, result: CloudinaryUploadResult | undefined) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });
        if (result?.secure_url) {
          urls.push(result.secure_url);
        }
      }

      if (urls.length === 0) {
        return res.status(400).json({ error: 'No valid image files to upload' });
      }

      res.json({ urls });
    } catch (error: any) {
      next(error);
    }
  },
};
