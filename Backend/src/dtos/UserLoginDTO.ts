// src/dto/UserLoginDTO.ts
import { z } from 'zod';

export const UserLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export type UserLoginDTO = z.infer<typeof UserLoginSchema>;
