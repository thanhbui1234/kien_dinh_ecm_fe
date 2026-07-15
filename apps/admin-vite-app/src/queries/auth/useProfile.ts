import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { authKeys } from 'shared-api';
import { UserProfile } from 'shared-api';

export const useProfile = (options?: { enabled?: boolean }) => {
  const client = axiosInstance;

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await client.get<any, { data: UserProfile }>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },
    enabled: options?.enabled !== false,
  });
};
