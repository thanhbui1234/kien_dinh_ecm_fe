import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { UserProfile } from '../../shared/schemas';

export const createAuthApi = (client: FetchClient) => ({
  getProfile: async (options?: RequestInit): Promise<UserProfile> => {
    return await client.get<UserProfile>(API_ENDPOINTS.AUTH.ME, options);
  },
  // Tương lai có thể thêm:
  // login: async (data, options) => { ... }
});
