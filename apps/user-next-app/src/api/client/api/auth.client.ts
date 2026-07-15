import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { UserProfile } from 'shared-api';

export const createAuthApi = (client: FetchClient) => ({
  getProfile: async (options?: RequestInit): Promise<UserProfile> => {
    return await client.get<UserProfile>(API_ENDPOINTS.AUTH.ME, options);
  },
  // Tương lai có thể thêm:
  // login: async (data, options) => { ... }
});
