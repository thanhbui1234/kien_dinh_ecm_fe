import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { productKeys } from 'shared-api';
import { Product, PageMeta } from 'shared-api';

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: boolean;
  isFeatured?: boolean;
  sortBy?: string;
}

export const useProducts = (params?: GetProductsParams) => {
  const client = axiosInstance;

  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Product[]; meta: PageMeta } }>(
        API_ENDPOINTS.PRODUCTS.BASE,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
