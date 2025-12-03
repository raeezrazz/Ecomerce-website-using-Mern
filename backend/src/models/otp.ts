import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  _id: string;
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Auto-delete after 5 minutes (300 seconds)
  },
});

const Otp = mongoose.model<IOtp>('Otp', OtpSchema);
export default Otp;