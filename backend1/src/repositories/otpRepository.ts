// src/repositories/otpRepositoryImpl.ts
import Otp from '../models/otp';
import { injectable } from 'inversify';


export interface IOtpRepository {
    saveOrUpdateOtp(email: string, otp: string ): Promise<void>;
    getOtpByEmail(email: string): Promise<{ otp: string } | null>;
  }
  

@injectable()
export class OtpRepository implements IOtpRepository {

  async saveOrUpdateOtp(email: string, otp: string): Promise<void> {
    await Otp.findOneAndUpdate(
      { email },
      { otp},
      { upsert: true }
    );
  }

  async getOtpByEmail(email: string): Promise<{ otp: string} | null> {
    const record = await Otp.findOne({ email });
    if (!record || !record?.otp) return null;
    return { otp: record.otp };
  }

}
