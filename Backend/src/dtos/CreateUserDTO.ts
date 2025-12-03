// src/dto/CreateUserDTO.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(1, "Phone number is required")
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits (0-9)"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password must be less than 50 characters"),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
