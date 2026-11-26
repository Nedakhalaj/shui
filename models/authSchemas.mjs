import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(20),
  password: z.string().min(10),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
