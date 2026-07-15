import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { authKeys } from '../../../shared/keys/auth.keys';
import { UserProfile } from '../../../shared/schemas';

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
