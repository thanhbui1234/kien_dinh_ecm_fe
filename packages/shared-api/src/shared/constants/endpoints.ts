export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },
  UPLOAD: '/api/v1/upload',
  HEALTH: '/api/v1/health',
  CATEGORIES: {
    BASE: '/api/v1/categories',
    DETAIL: (id: string) => `/api/v1/categories/${id}`,
  },
  PRODUCTS: {
    BASE: '/api/v1/products',
    DETAIL: (id: string) => `/api/v1/products/${id}`,
    RELATED: (id: string) => `/api/v1/products/${id}/related`,
    VIEW: (id: string) => `/api/v1/products/${id}/view`,
    COPY: (id: string) => `/api/v1/products/${id}/copy`,
  },
  PROJECTS: {
    BASE: '/api/v1/projects',
    DETAIL: (id: string) => `/api/v1/projects/${id}`,
  },
  JOBS: {
    BASE: '/api/v1/jobs',
    DETAIL_SLUG: (slug: string) => `/api/v1/jobs/${slug}`,
    DETAIL_ID: (id: string) => `/api/v1/jobs/${id}`,
  },
  LEADS: {
    BASE: '/api/v1/leads',
    STATUS: (id: string) => `/api/v1/leads/${id}/status`,
  },
  SETTINGS: {
    SYSTEM: '/api/v1/settings/system',
    SYSTEM_KEY: (key: string) => `/api/v1/settings/system/${key}`,
    SLOGANS: '/api/v1/settings/slogans',
    SLOGANS_DETAIL: (id: string) => `/api/v1/settings/slogans/${id}`,
    TIMELINES: '/api/v1/settings/timelines',
    TIMELINES_DETAIL: (id: string) => `/api/v1/settings/timelines/${id}`,
    BANNERS: '/api/v1/settings/banners',
    BANNERS_DETAIL: (id: string) => `/api/v1/settings/banners/${id}`,
  },
} as const;
