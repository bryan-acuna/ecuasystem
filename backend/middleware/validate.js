/**
 * Validate `req.body` against a zod schema. On failure, respond 400 with the
 * field-level error map. On success, replace `req.body` with the parsed
 * (and stripped) value so downstream code only sees known fields.
 */
const validate = schema => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  req.body = result.data;
  next();
};

export default validate;
