import { PrismaClient } from '@prisma/client';
import asyncHandler from '../middleware/asyncHandler.js';

const prisma = new PrismaClient();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const where = category ? { category: { equals: category, mode: 'insensitive' } } : {};
  const products = await prisma.product.findMany({ where });
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

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
export const createProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, countInStock, description } =
    req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      image,
      brand,
      category,
      countInStock: parseInt(countInStock),
      description,
      rating: 0,
      numReviews: 0,
      userId: req.user.id,
    },
  });

  res.status(201).json(product);
});
