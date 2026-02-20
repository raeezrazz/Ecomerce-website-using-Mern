import { v2 as cloudinary } from 'cloudinary';

/** Call once at app start or before first upload so env is loaded. */
export function ensureCloudinaryConfig(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    return true;
  }
  return false;
}

// Configure on module load (after dotenv has run in server.ts)
ensureCloudinaryConfig();

export { cloudinary };
