import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { productKeys } from '@api/shared/keys/products.keys';
import { Product } from '@api/shared/schemas';

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
