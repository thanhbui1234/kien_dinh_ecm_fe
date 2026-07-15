import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { productKeys } from 'shared-api';
import { Product } from 'shared-api';

export const useProductDetail = (id: string) => {
  const client = axiosInstance;

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};
