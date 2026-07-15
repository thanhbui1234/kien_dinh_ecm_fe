import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { CreateLeadInput, Lead } from 'shared-api';

export const createLeadsApi = (client: FetchClient) => ({
  submitLead: async (
    data: CreateLeadInput,
    options?: RequestInit
  ): Promise<Lead> => {
    return await client.post<Lead>(API_ENDPOINTS.LEADS.BASE, data, options);
  }
});
