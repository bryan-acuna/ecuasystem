import { PrismaClient } from '@prisma/client';
import { matchPassword } from '../utils/userHelper.js';
import asyncHandler from '../middleware/asyncHandler.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

const prisma = new PrismaClient();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await matchPassword(password, user.password))) {
    generateToken(res, user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  //Check if email already exist
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    res.status(400);
    throw new Error('User already exist');
  } else {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      },
    });
    if (newUser) {
      generateToken(res, newUser);
      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('Invalid user data');
    }
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        ...(req.body.password && { password: req.body.password }),
      },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await prisma.user.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
  });

  if (user) {
    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        isAdmin: req.body.isAdmin ?? user.isAdmin,
      },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
