import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { authKeys } from '@api/shared/keys/auth.keys';
import { UserProfile } from '@api/shared/schemas';

export const useProfile = (options?: { enabled?: boolean }) => {
  const client = useApiClient();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await client.get<any, { data: UserProfile }>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },
    enabled: options?.enabled !== false,
  });
};
