import bcrypt from 'bcryptjs';

export const matchPassword = async (
  enteredPassword: string,
  hashedPassword: string
): Promise<boolean> => bcrypt.compare(enteredPassword, hashedPassword);

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const sanitizeUser = <T extends { password?: string | null }>(
  user: T
): Omit<T, 'password'> => {
  const { password: _password, ...rest } = user;
  return rest;
};
