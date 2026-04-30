import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
  createProductSchema,
  updateProductSchema,
} from '../validators/productValidators.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, admin, validate(createProductSchema), createProduct);

router.get('/:id', getProductById);
router.put('/:id', protect, admin, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
