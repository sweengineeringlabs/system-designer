export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

export const endpoints = {
  generate: `${config.apiUrl}/generate`,
} as const;
