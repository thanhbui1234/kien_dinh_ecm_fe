import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, authKeys, UserProfileDto } from 'shared-api';
import { TokenService } from '@/utils/token';

export const useMe = () => {
  const token = TokenService.getAccessToken();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await axiosInstance.get<any, { data: UserProfileDto }>(API_ENDPOINTS.AUTH.ME);
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};
