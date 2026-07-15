import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { productKeys } from '@api/shared/keys/products.keys';
import { UpdateProductInput, Product } from '@api/shared/schemas';

export const useUpdateProduct = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
      const response = await client.patch<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
};
