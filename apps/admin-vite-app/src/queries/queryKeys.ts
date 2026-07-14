/**
 * Query Key Factory for React Query
 * Standardizes query keys to prevent typos and ensure consistent caching.
 */
export const queryKeys = {
  // Global / General
  all: ['all'] as const,
  
  // Example for 'users' entity
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: string | Record<string, unknown>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number | string) => [...queryKeys.users.details(), id] as const,
  },
  
  // Add other entities here...
  // products: { ... },
  // orders: { ... },
};
