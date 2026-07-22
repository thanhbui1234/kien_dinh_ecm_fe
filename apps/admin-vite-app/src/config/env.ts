export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000',
  REVALIDATE_SECRET: import.meta.env.VITE_REVALIDATE_SECRET || '',
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  GEMINI_FALLBACK_MODELS: import.meta.env.VITE_GEMINI_FALLBACK_MODELS || '',
  GEMINI_TEMPERATURE: parseFloat(import.meta.env.VITE_GEMINI_TEMPERATURE || '0.7'),
} as const;
