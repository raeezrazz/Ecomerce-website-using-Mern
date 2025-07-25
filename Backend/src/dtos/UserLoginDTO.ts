// src/dto/CreateUserDTO.ts
import { z } from 'zod';

export const UserLoginSchema = z.object({
  
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserLoginDTO = z.infer<typeof UserLoginSchema>;
