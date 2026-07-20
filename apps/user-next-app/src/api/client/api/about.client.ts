import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import type { CompanyInfo, Facility, CompanyHistoryEvent, CompanyProfile } from 'shared-api';
import { createSimpleListResource } from './resource-factory';

export const createAboutApi = (client: FetchClient) => ({
  getProfile: (config?: RequestInit) =>
    client.safeGet<CompanyProfile>(API_ENDPOINTS.ABOUT.PROFILE, config),
  getCompanyInfo: createSimpleListResource<CompanyInfo>(client, API_ENDPOINTS.ABOUT.COMPANY_INFO),
  getFacilities: createSimpleListResource<Facility>(client, API_ENDPOINTS.ABOUT.FACILITIES),
  getHistoryEvents: createSimpleListResource<CompanyHistoryEvent>(client, API_ENDPOINTS.ABOUT.HISTORY_EVENTS),
});
