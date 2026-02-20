import mongoose from 'mongoose';

// dotenv is loaded in server.ts via 'dotenv/config'
const mongoDB_url = process.env.MONGODB;

if (!mongoDB_url) {
  throw new Error('MONGODB connection string is missing in the environment variables.');
}

const maxRetries = 5;
const retryDelayMs = 3000;

export const connectDB = async (): Promise<void> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await mongoose.connect(mongoDB_url, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (error) {
      console.error(`❌ MongoDB connection failed (attempt ${attempt}/${maxRetries}):`, error);
      if (attempt === maxRetries) {
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, retryDelayMs));
    }
  }
};
