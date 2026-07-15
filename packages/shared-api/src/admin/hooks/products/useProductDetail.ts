import { useQuery } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { productKeys } from '../../../shared/keys/products.keys';
import { Product } from '../../../shared/schemas';

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
