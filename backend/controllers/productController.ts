import type { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import prisma from '../config/database.js';

interface ProductBody {
  name: string;
  price: number;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  countInStock: number;
  description: string;
}

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const category = typeof req.query.category === 'string' ? req.query.category : undefined;
  const where = category
    ? { category: { equals: category, mode: 'insensitive' as const } }
    : {};
  const products = await prisma.product.findMany({ where });
  res.json(products);
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!product) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as ProductBody;

  const product = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
      image: body.image,
      images: body.images ?? [],
      brand: body.brand,
      category: body.category,
      countInStock: body.countInStock,
      description: body.description,
      rating: 0,
      numReviews: 0,
      userId: req.user!.id,
    },
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as Partial<ProductBody>;

  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updated = await prisma.product.update({
    where: { id: req.params.id as string },
    data: {
      name: body.name ?? product.name,
      price: body.price ?? product.price,
      image: body.image ?? product.image,
      images: body.images ?? product.images,
      brand: body.brand ?? product.brand,
      category: body.category ?? product.category,
      countInStock: body.countInStock ?? product.countInStock,
      description: body.description ?? product.description,
    },
  });

  res.json(updated);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await prisma.product.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'Product deleted' });
});
