import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  authWithGoogle,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  updateProfileSchema,
  adminUpdateUserSchema,
} from '../validators/userValidators.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router
  .route('/')
  .post(authLimiter, validate(registerSchema), registerUser)
  .get(protect, admin, getUsers);
router.post('/logout', logoutUser);
router.post('/auth', authLimiter, validate(loginSchema), authUser);
router.post('/auth/google', authLimiter, validate(googleAuthSchema), authWithGoogle);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validate(updateProfileSchema), updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, validate(adminUpdateUserSchema), updateUser);

export default router;
