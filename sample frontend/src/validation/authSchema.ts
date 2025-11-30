// src/validations/userSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, { message: "Full name is required" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
});

export const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }).regex(/^\d+$/, {
    message: "OTP should contain only numbers",
  }),
});
