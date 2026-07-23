import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Banner, Timeline, Slogan, SystemSetting } from 'shared-api';
import { createSimpleListResource } from './resource-factory';

export const createSettingsApi = (client: FetchClient) => ({
  getBanners: (options?: RequestInit) => {
    const listResource = createSimpleListResource<Banner>(client, API_ENDPOINTS.SETTINGS.BANNERS);
    return listResource({ ...options, next: { tags: ['banners'] } } as any);
  },
  getTimelines: (options?: RequestInit) => {
    const listResource = createSimpleListResource<Timeline>(client, API_ENDPOINTS.SETTINGS.TIMELINES);
    return listResource({ ...options, next: { tags: ['timelines'] } } as any);
  },
  getSlogans: (options?: RequestInit) => {
    const listResource = createSimpleListResource<Slogan>(client, API_ENDPOINTS.SETTINGS.SLOGANS);
    return listResource({ ...options, next: { tags: ['slogans'] } } as any);
  },
  getSystemSettings: (options?: RequestInit) => {
    const listResource = createSimpleListResource<SystemSetting>(client, API_ENDPOINTS.SETTINGS.SYSTEM);
    return listResource({ ...options, next: { tags: ['system-settings'] } } as any);
  },
});
