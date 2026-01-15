// utils/userHelpers.js
import bcrypt from 'bcryptjs';
// import { User } from '@prisma/client';

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password from user
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
export const matchPassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

/**
 * Hash a password before saving to database
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Sanitize user data (remove password before sending to client)
 * @param {User} user - User object from Prisma
 * @returns {Object} User object without password
 */
export const sanitizeUser = user => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
