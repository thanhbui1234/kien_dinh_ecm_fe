import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import type { CompanyInfo, Facility, CompanyHistoryEvent, CompanyProfile } from 'shared-api';
import { createSimpleListResource } from './resource-factory';

export const createAboutApi = (client: FetchClient) => ({
  getProfile: (config?: RequestInit) =>
    client.safeGet<CompanyProfile>(API_ENDPOINTS.ABOUT.PROFILE, { ...config, next: { tags: ['about'] } } as any),
  getCompanyInfo: (options?: RequestInit) => {
    const listResource = createSimpleListResource<CompanyInfo>(client, API_ENDPOINTS.ABOUT.COMPANY_INFO);
    return listResource({ ...options, next: { tags: ['about'] } } as any);
  },
  getFacilities: (options?: RequestInit) => {
    const listResource = createSimpleListResource<Facility>(client, API_ENDPOINTS.ABOUT.FACILITIES);
    return listResource({ ...options, next: { tags: ['about'] } } as any);
  },
  getHistoryEvents: (options?: RequestInit) => {
    const listResource = createSimpleListResource<CompanyHistoryEvent>(client, API_ENDPOINTS.ABOUT.HISTORY_EVENTS);
    return listResource({ ...options, next: { tags: ['about'] } } as any);
  },
});
