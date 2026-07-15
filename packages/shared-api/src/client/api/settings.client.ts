import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { Banner, Timeline, Slogan, SystemSetting } from '../../shared/schemas';
import { createListResource } from './resource-factory';

export const createSettingsApi = (client: FetchClient) => ({
  getBanners: createListResource<Banner>(client, API_ENDPOINTS.SETTINGS.BANNERS),
  getTimelines: createListResource<Timeline>(client, API_ENDPOINTS.SETTINGS.TIMELINES),
  getSlogans: createListResource<Slogan>(client, API_ENDPOINTS.SETTINGS.SLOGANS),
  getSystemSettings: async (options?: RequestInit): Promise<SystemSetting[]> => {
    return await client.get<SystemSetting[]>(API_ENDPOINTS.SETTINGS.SYSTEM, options);
  }
});
