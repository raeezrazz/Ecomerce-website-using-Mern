import bcrypt from "bcrypt";
import Otp from "../models/otp";// You must have an OTP mongoose model
import { generateOtp } from "../utils/generateOtp";
import { sendEmail } from "../utils/nodemailer";

class OtpService {
  async generateOtp(email: string): Promise<void> {
    const otp = generateOtp(); // Example: "123456"
    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log("2")

    // store or update otp
    await Otp.findOneAndUpdate(
      { email },
      { otp: hashedOtp, createdAt: new Date() },
      { upsert: true }
    );
    console.log("3")

    // Send OTP Email
    await sendEmail(
      email,
      "Verify Your Email",
      "otpTemplate.html",
      { OTP: otp }
    );
    console.log("4")
    console.log(`OTP sent to ${email}:`, otp);
  }

  async verifyOtp(email: string, inputOtp: string): Promise<boolean> {
    if (!email || !inputOtp) return false;

    const record = await Otp.findOne({ email });
    if (!record || !record.otp) return false;

    const isMatch = await bcrypt.compare(inputOtp, record.otp);

    if (isMatch) {
      // ❗ Delete OTP after success so it can't be reused
      await Otp.deleteOne({ email });
    }

    return isMatch;
  }

  async resendOtp(email: string): Promise<void> {
    return this.generateOtp(email);
  }
}

export const otpService = new OtpService();
