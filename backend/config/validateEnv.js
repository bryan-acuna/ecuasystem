const validateEnv = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingVars = requiredEnvVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  // Validate JWT_SECRET strength in production
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }

  console.log('✓ Environment variables validated');
};

export default validateEnv;
