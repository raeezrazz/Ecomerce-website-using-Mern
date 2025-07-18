import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().length(10),
  password: z.string().min(6),
});
