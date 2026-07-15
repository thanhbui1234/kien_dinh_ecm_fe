import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, authKeys, LoginInput, TokenResponse } from 'shared-api';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/utils/toast';
import { TokenService } from '@/utils/token';

export const useLogin = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await client.post<any, { data: TokenResponse }>(API_ENDPOINTS.AUTH.LOGIN, data);
      return response.data;
    },
    onSuccess: (res) => {
      TokenService.setTokens(res.accessToken, res.refreshToken);
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      toast.success("Successfully logged in!");
      navigate('/');
    },
    onError: (error: any) => {
      toast.error(error, "Failed to log in. Please check your credentials.");
    }
  });
};
