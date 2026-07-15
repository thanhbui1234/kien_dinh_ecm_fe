import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { productKeys } from '@api/shared/keys/products.keys';
import { Product } from '@api/shared/schemas';

export const useProductDetail = (id: string) => {
  const client = useApiClient();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};
