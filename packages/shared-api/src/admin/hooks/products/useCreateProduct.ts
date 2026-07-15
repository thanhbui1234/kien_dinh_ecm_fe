import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { productKeys } from '../../../shared/keys/products.keys';
import { CreateProductInput, Product } from '../../../shared/schemas';

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
