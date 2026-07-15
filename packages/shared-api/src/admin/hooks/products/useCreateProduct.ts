import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { productKeys } from '@api/shared/keys/products.keys';
import { CreateProductInput, Product } from '@api/shared/schemas';

export const useCreateProduct = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await client.post<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
