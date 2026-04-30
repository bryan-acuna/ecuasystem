import { z } from 'zod';

const url = z.string().trim().url('Must be a valid URL');

const numericPrice = z
  .union([z.number(), z.string()])
  .transform(v => (typeof v === 'string' ? Number(v) : v))
  .refine(v => Number.isFinite(v) && v >= 0, {
    message: 'Price must be a non-negative number',
  });

const numericStock = z
  .union([z.number(), z.string()])
  .transform(v => (typeof v === 'string' ? Number(v) : v))
  .refine(v => Number.isInteger(v) && v >= 0, {
    message: 'countInStock must be a non-negative integer',
  });

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  price: numericPrice,
  image: url,
  images: z.array(url).max(20).optional().default([]),
  brand: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(100),
  countInStock: numericStock,
  description: z.string().trim().min(1).max(5000),
});

export const updateProductSchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  price: numericPrice.optional(),
  image: url.optional(),
  images: z.array(url).max(20).optional(),
  brand: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).max(100).optional(),
  countInStock: numericStock.optional(),
  description: z.string().trim().min(1).max(5000).optional(),
});
