import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "At least one uppercase letter required")
      .regex(/[a-z]/, "At least one lowercase letter required")
      .regex(/[0-9]/, "At least one number required")
      .regex(/[^a-zA-Z0-9]/, "At least one special character required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
