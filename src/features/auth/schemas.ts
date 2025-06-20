import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Required"),
});

export const registerSchema = z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  });

export type LoginSchema = z.infer<typeof loginSchema>;

export type RegisterSchema = z.infer<typeof registerSchema>;

