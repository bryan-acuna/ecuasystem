import type { Request, Response } from 'express';
import { matchPassword, hashPassword, sanitizeUser } from '../utils/userHelper.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../config/database.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && user.password && (await matchPassword(password, user.password))) {
    generateToken(res, user.id);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
    return;
  }
  res.status(401);
  throw new Error('Invalid email or password');
});

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400);
    throw new Error('User already exist');
  }

  const newUser = await prisma.user.create({
    data: { name, email, password: await hashPassword(password) },
  });

  generateToken(res, newUser.id);
  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
  });
});

const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const body = req.body as { name?: string; email?: string; password?: string };

  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: {
      name: body.name ?? user.name,
      email: body.email ?? user.email,
      ...(body.password && { password: await hashPassword(body.password) }),
    },
  });

  res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users.map(sanitizeUser));
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.isAdmin) {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  await prisma.user.delete({ where: { id: req.params.id as string } });
  res.json({ message: 'User removed' });
});

const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(sanitizeUser(user));
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id as string } });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const body = req.body as { name?: string; email?: string; isAdmin?: boolean };

  const updatedUser = await prisma.user.update({
    where: { id: req.params.id as string },
    data: {
      name: body.name ?? user.name,
      email: body.email ?? user.email,
      isAdmin: body.isAdmin ?? user.isAdmin,
    },
  });

  res.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
});

const authWithGoogle = asyncHandler(async (req: Request, res: Response) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    res.status(501);
    throw new Error('Google login is not configured on this server');
  }

  const { credential } = req.body as { credential: string };

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    res.status(401);
    throw new Error('Invalid Google credential');
  }

  const { sub: googleId, email, name, email_verified } = payload;

  if (!email_verified || !email || !name) {
    res.status(401);
    throw new Error('Google email not verified');
  }

  let user = await prisma.user.findUnique({ where: { googleId } });

  if (!user) {
    user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      user = await prisma.user.update({ where: { email }, data: { googleId } });
    } else {
      user = await prisma.user.create({ data: { name, email, googleId } });
    }
  }

  generateToken(res, user.id);
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
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
  authWithGoogle,
};
