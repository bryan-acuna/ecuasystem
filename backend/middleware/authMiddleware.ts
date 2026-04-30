import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from './asyncHandler.js';
import prisma from '../config/database.js';
import type { JwtPayload } from '../utils/generateToken.js';

const isJwtPayload = (value: unknown): value is JwtPayload =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { userId?: unknown }).userId === 'string';

export const protect: RequestHandler = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt as string | undefined;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500);
    throw new Error('Server misconfigured');
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (!isJwtPayload(decoded)) {
      res.status(401);
      throw new Error('Not authorized, invalid token payload');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, isAdmin: true },
    });

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    const err = error as Error;
    console.error('Authentication error:', err);

    if (err.name === 'JsonWebTokenError') {
      res.status(401);
      throw new Error('Not authorized, invalid token');
    }
    if (err.name === 'TokenExpiredError') {
      res.status(401);
      throw new Error('Not authorized, token expired');
    }

    if (!res.statusCode || res.statusCode === 200) res.status(401);
    throw err;
  }
});

export const admin = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  }
  _res.status(401);
  next(new Error('Not authorized as admin'));
};
