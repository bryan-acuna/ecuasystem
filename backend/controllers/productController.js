import { PrismaClient } from '@prisma/client';
import asyncHandler from '../middleware/asyncHandler.js';

const prisma = new PrismaClient();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) {
    res.status(404);
    throw new Error('Resource not found');
  }
  res.json(product);
});
