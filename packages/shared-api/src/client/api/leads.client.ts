import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { CreateLeadInput, Lead } from '../../shared/schemas';

export const createLeadsApi = (client: FetchClient) => ({
  submitLead: async (
    data: CreateLeadInput,
    options?: RequestInit
  ): Promise<Lead> => {
    return await client.post<Lead>(API_ENDPOINTS.LEADS.BASE, data, options);
  }
});
