export const AUTH_REASONS = {
  KICKED: 'kicked',
  LOCKED: 'locked',
} as const;

export type AuthReason = typeof AUTH_REASONS[keyof typeof AUTH_REASONS];
