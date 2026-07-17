import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Banner, Timeline, Slogan, SystemSetting } from 'shared-api';
import { createSimpleListResource } from './resource-factory';

export const createSettingsApi = (client: FetchClient) => ({
  getBanners: createSimpleListResource<Banner>(client, API_ENDPOINTS.SETTINGS.BANNERS),
  getTimelines: createSimpleListResource<Timeline>(client, API_ENDPOINTS.SETTINGS.TIMELINES),
  getSlogans: createSimpleListResource<Slogan>(client, API_ENDPOINTS.SETTINGS.SLOGANS),
  getSystemSettings: createSimpleListResource<SystemSetting>(client, API_ENDPOINTS.SETTINGS.SYSTEM),
});
