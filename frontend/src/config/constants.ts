export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
export const IS_PRODUCTION = import.meta.env.MODE === 'production';
export const IS_DEVELOPMENT = import.meta.env.MODE === 'development';

export const APP_CONFIG = {
  name: 'Ecuasystems',
  description: 'E-commerce platform',
  version: '1.0.0',
};

export const RATE_LIMITS = {
  maxCartItems: 50,
  maxImageSize: 5 * 1024 * 1024, // 5MB
};
