import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';

export const useLogout = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await client.post<any, { data: boolean }>(API_ENDPOINTS.AUTH.LOGOUT);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
