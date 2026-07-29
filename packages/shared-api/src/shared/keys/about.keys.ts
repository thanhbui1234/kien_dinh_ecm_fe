export const aboutKeys = {
  all: ['about'] as const,
  profile: () => [...aboutKeys.all, 'profile'] as const,
  companyInfo: () => [...aboutKeys.all, 'company-info'] as const,
  facilities: () => [...aboutKeys.all, 'facilities'] as const,
  historyEvents: () => [...aboutKeys.all, 'history-events'] as const,
  locations: () => [...aboutKeys.all, 'locations'] as const,
};
