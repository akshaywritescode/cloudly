import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email({ message: "Invalid email address" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Must include a lowercase letter" })
      .regex(/[A-Z]/, { message: "Must include an uppercase letter" })
      .regex(/[0-9]/, { message: "Must include a digit" })
      .regex(/[^a-zA-Z0-9]/, { message: "Must include a symbol" }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });