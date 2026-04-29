/**
 * Only allow same-origin relative paths. Anything starting with a scheme,
 * protocol-relative `//`, or backslash is rejected and falls back to `/`.
 */
export const sanitizeRedirect = (raw: string | null | undefined): string => {
  if (!raw) return '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('//') || raw.startsWith('/\\')) return '/';
  return raw;
};
