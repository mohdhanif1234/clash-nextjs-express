import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string({ message: "Name field is required." })
      .min(3, { message: "Name must be 3 characters long." }),
    email: z
      .string({ message: "Email field is required." })
      .min(3, { message: "Name must be 3 characters long." })
      .email({ message: "Please type correct email." }),
    password: z
      .string({ message: "Password field is required." })
      .min(6, { message: "Password must be 6 characters long." }),
    confirmPassword: z
      .string({ message: "Confirm Password field is required." })
      .min(6, { message: "Confirm Password must be 6 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string({ message: "Email field is required." })
    .email({ message: "Email must be a correct email." }),
  password: z.string({ message: "Password field is required." }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string({ message: "Email field is required." })
    .email({ message: "Email must be a correct email." }),
});

export const resetPasswordSchema = z.object({
    email: z
      .string({ message: "Email field is required." })
      .min(3, { message: "Name must be 3 characters long." })
      .email({ message: "Please type correct email." }),
    token: z
      .string({ message: "Token is required." }),
    password: z
      .string({ message: "Password field is required." })
      .min(6, { message: "Password must be 6 characters long." }),
    confirmPassword: z
      .string({ message: "Confirm Password field is required." })
      .min(6, { message: "Confirm Password must be 6 characters long." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

