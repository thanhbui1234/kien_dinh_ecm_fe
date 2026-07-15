import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { authKeys } from '@api/shared/keys/auth.keys';
import { LoginInput, TokenResponse } from '@api/shared/schemas';

export const useLogin = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await client.post<any, { data: TokenResponse }>(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
};
