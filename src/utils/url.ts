export const buildUrl = (path: string, params?: Record<string, string | string[]>) => {
  const search = new URLSearchParams(params as Record<string, string>).toString();
  return `${path}${search ? `?${search}` : ''}`;
}