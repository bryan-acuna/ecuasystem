import jwt from 'jsonwebtoken';

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
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
