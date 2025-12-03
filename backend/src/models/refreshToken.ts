import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete expired tokens
  },
});

// Compound index for faster lookups
RefreshTokenSchema.index({ userId: 1, token: 1 });

export const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);



