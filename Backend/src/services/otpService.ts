import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { OtpRepository,IOtpRepository } from '../repositories/otpRepository';
import { TYPES } from '../types/types';
import { generateOtp } from '../utils/generateOtp';
import { sendEmail } from '../utils/nodemailer';

@injectable()
export class OtpService {
  constructor(
    @inject(TYPES.OtpRepository) private otpRepository: IOtpRepository
  ) {}

  async generateOtp(email: string): Promise<void> {
    const otp = generateOtp(); // e.g., '123456'
    
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
  
    await this.otpRepository.saveOrUpdateOtp(email, hashedOtp);
  
    
await sendEmail(
   email,
    'Verify your Email',
    'otpTemplate.html',
    { OTP:otp }
  );
    console.log(`OTP for ${email}: ${otp}`);
  }

  async verifyOtp(email: string, inputOtp: string): Promise<boolean> {
    const record = await this.otpRepository.getOtpByEmail(email);
    if (!record) return false;
  
    const isMatch = await bcrypt.compare(inputOtp, record.otp); 
  
    return isMatch;
  }
  

// async resendOtp(email: string): Promise<string> {
  
  
//     const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
//     user.otp = newOtp;
//     user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
//     await user.save();
  
//     await this.emailService.sendOtp(email, newOtp); 
  
//     return "OTP resent successfully";
//   }
  
}
