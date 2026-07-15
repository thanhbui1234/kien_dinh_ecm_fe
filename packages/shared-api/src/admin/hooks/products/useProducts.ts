import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { productKeys } from '../../../shared/keys/products.keys';
import { Product, PageMeta } from '../../../shared/schemas';

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
  const client = useApiClient();

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
