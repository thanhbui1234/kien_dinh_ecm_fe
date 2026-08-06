export const settingKeys = {
  all: ['settings'] as const,
  system: () => [...settingKeys.all, 'system'] as const,
  banners: (lang?: string) => lang ? [...settingKeys.all, 'banners', lang] as const : [...settingKeys.all, 'banners'] as const,
  timelines: () => [...settingKeys.all, 'timelines'] as const,
  slogans: () => [...settingKeys.all, 'slogans'] as const,
  contact: (lang?: string) => lang ? [...settingKeys.all, 'contact', lang] as const : [...settingKeys.all, 'contact'] as const,
  footer: (lang?: string) => lang ? [...settingKeys.all, 'footer', lang] as const : [...settingKeys.all, 'footer'] as const,
};
