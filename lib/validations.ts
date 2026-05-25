import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const noteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject too long"),
  description: z.string().max(1000, "Description too long").optional(),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  subject: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type SearchInput = z.infer<typeof searchSchema>;