import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Invalid email');
const password = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(128);
const name = z.string().trim().min(1, 'Name is required').max(100);

export const registerSchema = z.object({ name, email, password });

export const loginSchema = z.object({ email, password: z.string().min(1) });

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Credential is required'),
});

export const updateProfileSchema = z
  .object({
    name: name.optional(),
    email: email.optional(),
    password: password.optional(),
  })
  .refine(v => v.name || v.email || v.password, {
    message: 'At least one field is required',
  });

export const adminUpdateUserSchema = z.object({
  name: name.optional(),
  email: email.optional(),
  isAdmin: z.boolean().optional(),
});
