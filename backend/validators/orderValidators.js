import { z } from 'zod';

const nonNegative = z.number().nonnegative();

const orderItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  image: z.string().min(1),
  price: nonNegative,
  qty: z.number().int().positive(),
  countInStock: z.number().int().nonnegative().optional(),
});

const shippingAddressSchema = z.object({
  address: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(100),
  postalCode: z.string().trim().min(1).max(20),
  country: z.string().trim().min(1).max(100),
});

export const createOrderSchema = z.object({
  orderItems: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['PayPal', 'CreditCard', 'Stripe']),
  itemsPrice: nonNegative,
  shippingPrice: nonNegative,
  taxPrice: nonNegative,
  totalPrice: nonNegative,
});

export const payOrderSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  update_time: z.string().optional(),
  email_address: z.string().email().optional(),
  payer: z.unknown().optional(),
});
