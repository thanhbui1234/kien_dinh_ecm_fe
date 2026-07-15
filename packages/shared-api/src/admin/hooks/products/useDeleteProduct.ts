import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { productKeys } from '../../../shared/keys/products.keys';
import { Product } from '../../../shared/schemas';

export const useDeleteProduct = () => {
  const client = useApiClient();
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
