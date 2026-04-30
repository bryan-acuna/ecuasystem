const validateEnv = (): void => {
  const requiredEnvVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET'] as const;

  const missingVars = requiredEnvVars.filter(name => !process.env[name]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (
    process.env.NODE_ENV === 'production' &&
    (process.env.JWT_SECRET ?? '').length < 32
  ) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  console.log('✓ Environment variables validated');
};

export default validateEnv;
