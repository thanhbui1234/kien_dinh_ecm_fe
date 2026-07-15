import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { productKeys } from 'shared-api';
import { Product } from 'shared-api';

export const useDeleteProduct = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
