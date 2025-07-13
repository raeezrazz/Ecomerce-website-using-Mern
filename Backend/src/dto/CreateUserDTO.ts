// src/dto/CreateUserDTO.ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
