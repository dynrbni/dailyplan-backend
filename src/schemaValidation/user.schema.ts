import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(3, "Name minimum 3 characters"),
  email: z.string().email("Email format not valid"),
  password: z.string().min(6, "Password minimal 6 characters")
})

export const loginSchema = z.object({
  email: z.string().email("Email format not valid"),
  password: z.string().min(6, "Password minimal 6 characters")
})

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional()
})
