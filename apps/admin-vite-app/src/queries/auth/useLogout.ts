import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { TokenService } from '@/utils/token';

export const useLogout = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.post<any, { data: boolean }>(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      TokenService.clearTokens();
      window.location.href = '/login';
    },
    onError: () => {
      // Dù lỗi hay không cũng nên clear token và đá về login cho an toàn
      queryClient.clear();
      TokenService.clearTokens();
      window.location.href = '/login';
    }
  });
};
