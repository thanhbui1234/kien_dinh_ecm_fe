import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Banner, Timeline, Slogan, SystemSetting } from 'shared-api';
import { createListResource } from './resource-factory';

export const createSettingsApi = (client: FetchClient) => ({
  getBanners: createListResource<Banner>(client, API_ENDPOINTS.SETTINGS.BANNERS),
  getTimelines: createListResource<Timeline>(client, API_ENDPOINTS.SETTINGS.TIMELINES),
  getSlogans: createListResource<Slogan>(client, API_ENDPOINTS.SETTINGS.SLOGANS),
  getSystemSettings: async (options?: RequestInit): Promise<SystemSetting[]> => {
    return await client.get<SystemSetting[]>(API_ENDPOINTS.SETTINGS.SYSTEM, options);
  }
});
