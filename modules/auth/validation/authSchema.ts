import { z } from "zod";

// ---------------------
// Register Schema
// ---------------------
export const RegisterSchema = z
  .object({
    name: z.string().min(3, "Name must at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Muat contain at least one number"),
    confirmPassword: z.string().min(6, "Confirm your password"),
    role: z.enum(["admin", "user"]).default("admin"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof RegisterSchema>;

// ---------------------
// Login Schema
// ---------------------
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 charactes"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
