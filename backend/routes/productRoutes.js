import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, admin, createProduct);

router.get('/:id', getProductById);

export default router;
