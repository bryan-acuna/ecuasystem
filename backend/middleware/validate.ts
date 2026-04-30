import type { RequestHandler } from 'express';
import type { ZodSchema } from 'zod';

const validate =
  <T>(schema: ZodSchema<T>): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }
    req.body = result.data;
    next();
  };

export default validate;
