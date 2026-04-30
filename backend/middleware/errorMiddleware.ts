import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const error = err as { name?: string; message?: string; stack?: string; kind?: string };
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message ?? 'Server error';

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    message = 'Resource not found';
    statusCode = 404;
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR CAUGHT:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Status Code:', statusCode);
    console.error('Message:', message);
    console.error('Error Name:', error.name);
    console.error('Stack Trace:', error.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
};
