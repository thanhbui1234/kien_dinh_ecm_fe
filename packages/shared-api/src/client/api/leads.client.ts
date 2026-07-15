import { FetchClient } from '@api/core/fetch-client';
import { API_ENDPOINTS } from '@api/shared/constants';
import { CreateLeadInput, Lead } from '@api/shared/schemas';

export const createLeadsApi = (client: FetchClient) => ({
  submitLead: async (
    data: CreateLeadInput,
    options?: RequestInit
  ): Promise<Lead> => {
    return await client.post<Lead>(API_ENDPOINTS.LEADS.BASE, data, options);
  }
});
