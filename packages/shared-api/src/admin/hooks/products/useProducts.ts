import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '@api/core/ApiProvider';
import { API_ENDPOINTS } from '@api/shared/constants';
import { productKeys } from '@api/shared/keys/products.keys';
import { Product, PageMeta } from '@api/shared/schemas';

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
