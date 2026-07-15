export const settingKeys = {
  all: ['settings'] as const,
  system: () => [...settingKeys.all, 'system'] as const,
  banners: () => [...settingKeys.all, 'banners'] as const,
  timelines: () => [...settingKeys.all, 'timelines'] as const,
  slogans: () => [...settingKeys.all, 'slogans'] as const,
};
