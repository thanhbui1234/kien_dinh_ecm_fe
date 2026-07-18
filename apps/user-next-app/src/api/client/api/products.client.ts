import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Product } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createProductsApi = (client: FetchClient) => ({
  getProducts: createListResource<Product>(client, API_ENDPOINTS.PRODUCTS.BASE),
  getProductDetail: createDetailResource<Product>(client, API_ENDPOINTS.PRODUCTS.DETAIL),
  getRelatedProducts: async (id: string): Promise<Product[] | null> => {
    return await client.safeGet<Product[]>(API_ENDPOINTS.PRODUCTS.RELATED(id));
  },
  incrementViewCount: async (id: string): Promise<Product | null> => {
    try {
      return await client.patch<Product>(API_ENDPOINTS.PRODUCTS.VIEW(id), {});
    } catch {
      return null;
    }
  },
});
