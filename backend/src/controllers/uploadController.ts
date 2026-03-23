import { Request, Response, NextFunction } from 'express';
import { cloudinary, ensureCloudinaryConfig } from '../config/cloudinary';
import { Readable } from 'stream';

/** Get uploaded files from request (multer attaches to req.files for .array()). */
function getFiles(req: Request): Express.Multer.File[] {
  const files = (req as Request & { files?: Express.Multer.File[] }).files;
  if (Array.isArray(files)) return files;
  return [];
}

/** Return a JSON error response with a clear message. */
function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({ success: false, error: message });
}

/** Turn Cloudinary/network errors into a short user-friendly message. */
function toUserMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('invalid credentials') || msg.includes('authentication')) {
      return 'Invalid Cloudinary credentials. Check your API key and secret in .env.';
    }
    if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('timeout')) {
      return 'Unable to reach Cloudinary. Check your internet connection and try again.';
    }
    if (msg.includes('file size') || msg.includes('too large')) {
      return 'Image is too large. Maximum size is 25MB per image.';
    }
    if (msg.includes('invalid') && msg.includes('image')) {
      return 'Invalid image file. Please use JPEG, PNG, GIF, or WebP.';
    }
    return err.message;
  }
  return 'Image upload failed. Please try again.';
}

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const files = getFiles(req);

      if (files.length === 0) {
        return sendError(
          res,
          400,
          'No images received. Please select one or more image files (JPEG, PNG, GIF, or WebP) and try again.'
        );
      }

      if (!ensureCloudinaryConfig()) {
        return sendError(
          res,
          503,
          'Image upload is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the server .env file.'
        );
      }

      const urls: string[] = [];
      const skipped: string[] = [];

      for (const file of files) {
        if (!file.mimetype?.startsWith('image/')) {
          skipped.push(file.originalname || 'Unknown file');
          continue;
        }
        if (!file.buffer || file.buffer.length === 0) {
          skipped.push(file.originalname || 'Unknown file');
          continue;
        }

        try {
          // Stream upload avoids base64 conversion (much faster + more reliable on mobile).
          const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              {
                folder: 'rsmeters/products',
                resource_type: 'image',
              },
              (err: any, uploaded: any) => {
                if (err) return reject(err);
                resolve(uploaded);
              }
            );

            Readable.from(file.buffer).pipe(uploadStream);
          });

          if (result?.secure_url) urls.push(result.secure_url);
          else skipped.push(file.originalname || 'Unknown file');
        } catch (err: unknown) {
          const userMessage = toUserMessage(err);
          console.error('[Upload] Cloudinary error:', err instanceof Error ? err.message : err);
          return sendError(res, 502, userMessage);
        }
      }

      if (urls.length === 0) {
        if (skipped.length > 0) {
          return sendError(
            res,
            400,
            'No valid images could be uploaded. Please use only image files (JPEG, PNG, GIF, or WebP) under 25MB each.'
          );
        }
        return sendError(
          res,
          400,
          'No images could be processed. Please try different image files.'
        );
      }

      res.json({ success: true, urls });
    } catch (error: unknown) {
      const message = toUserMessage(error);
      console.error('[Upload] Error:', error instanceof Error ? error.message : error);
      return sendError(res, 500, message);
    }
  },
};
