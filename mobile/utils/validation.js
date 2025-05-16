import { z } from "zod";

// Define the Zod schema for login validation
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

// Define the Zod schema for signup validation
export const signupSchema = z.object({
  username: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Name is required"),
  email: z
    .string()
    .email("Please enter a valid email")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
}); 

export const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  caption: z.string().min(10, "Description must be at least 10 characters"),
  rating: z.number().min(1).max(5),
});
