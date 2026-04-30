import jwt from 'jsonwebtoken';
import type { Response } from 'express';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface JwtPayload {
  userId: string;
}

const generateToken = (res: Response, userId: string): void => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');

  const token = jwt.sign({ userId } satisfies JwtPayload, secret, {
    expiresIn: '7d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: TOKEN_TTL_MS,
  });
};

export default generateToken;
