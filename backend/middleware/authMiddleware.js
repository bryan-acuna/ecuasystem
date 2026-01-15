import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      });
      console.log(user);
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      req.user = user;
      next();
    } catch (error) {
      console.error('Authentication error:', error);

      if (error.name === 'JsonWebTokenError') {
        res.status(401);
        throw new Error('Not authorized, invalid token');
      }

      if (error.name === 'TokenExpiredError') {
        res.status(401);
        throw new Error('Not authorized, token expired');
      }

      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const admin = asyncHandler((req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as admin');
  }
});
