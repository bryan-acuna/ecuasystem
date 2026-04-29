import express from 'express';
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
  createOrderSchema,
  payOrderSchema,
} from '../validators/orderValidators.js';

const router = express.Router();

router
  .route('/')
  .post(protect, validate(createOrderSchema), addOrderItems)
  .get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, validate(payOrderSchema), updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
