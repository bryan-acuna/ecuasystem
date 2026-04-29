export const getErrorMessage = (err: unknown, fallback = 'Something went wrong'): string => {
  if (typeof err === 'object' && err !== null) {
    const data = (err as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
    const message = (err as { message?: string }).message;
    if (typeof message === 'string') return message;
  }
  return fallback;
};
