import bcrypt from "bcrypt";
import Otp from "../models/otp";
import { generateOtp } from "../utils/generateOtp";
import { sendEmail } from "../utils/nodemailer";
import { ValidationError } from "../errors/conflictErrors";

// OTP expires in 5 minutes (300 seconds)
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
// Rate limiting: max 3 OTP requests per email per 15 minutes
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_OTP_REQUESTS = 3;

class OtpService {
  async generateOtp(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError("Email is required");
    }

    // Check rate limiting
    const recentOtps = await Otp.find({
      email,
      createdAt: { $gte: new Date(Date.now() - RATE_LIMIT_WINDOW) },
    });

    if (recentOtps.length >= MAX_OTP_REQUESTS) {
      throw new ValidationError(
        `Too many OTP requests. Please wait ${Math.ceil(RATE_LIMIT_WINDOW / 60000)} minutes before requesting again.`
      );
    }

    const otp = generateOtp(6);
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Store or update OTP with expiration
    await Otp.findOneAndUpdate(
      { email },
      {
        otp: hashedOtp,
        createdAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Send OTP Email
    try {
      await sendEmail(email, "Verify Your Email", "otpTemplate.html", { OTP: otp });
      console.log(`OTP sent to ${email}`);
    } catch (error: any) {
      // If email fails, delete the OTP record
      await Otp.deleteOne({ email });
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }

  async verifyOtp(email: string, inputOtp: string): Promise<boolean> {
    if (!email || !inputOtp) {
      return false;
    }

    const record = await Otp.findOne({ email });
    if (!record || !record.otp) {
      return false;
    }

    // Check if OTP has expired
    const now = new Date();
    const otpAge = now.getTime() - record.createdAt.getTime();
    if (otpAge > OTP_EXPIRY_TIME) {
      // Delete expired OTP
      await Otp.deleteOne({ email });
      return false;
    }

    const isMatch = await bcrypt.compare(inputOtp, record.otp);

    if (isMatch) {
      // Delete OTP after successful verification to prevent reuse
      await Otp.deleteOne({ email });
    }

    return isMatch;
  }

  async resendOtp(email: string): Promise<void> {
    if (!email) {
      throw new ValidationError("Email is required");
    }

    // Delete any existing OTP for this email before generating a new one
    await Otp.deleteOne({ email });

    // Generate and send new OTP
    await this.generateOtp(email);
  }
}

export const otpService = new OtpService();
