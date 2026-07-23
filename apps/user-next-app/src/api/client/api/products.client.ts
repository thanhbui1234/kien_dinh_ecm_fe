import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Product } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createProductsApi = (client: FetchClient) => ({
  getProducts: (params?: Record<string, string>, options?: RequestInit) => {
    const listResource = createListResource<Product>(client, API_ENDPOINTS.PRODUCTS.BASE);
    return listResource(params, { ...options, next: { tags: ['products'] } } as any);
  },
  getProductDetail: (id: string, options?: RequestInit) => {
    const detailResource = createDetailResource<Product>(client, API_ENDPOINTS.PRODUCTS.DETAIL);
    return detailResource(id, { ...options, next: { tags: ['products'] } } as any);
  },
  getRelatedProducts: async (id: string, options?: RequestInit): Promise<Product[] | null> => {
    return await client.safeGet<Product[]>(API_ENDPOINTS.PRODUCTS.RELATED(id), { ...options, next: { tags: ['products'] } } as any);
  },
  incrementViewCount: async (id: string): Promise<Product | null> => {
    try {
      return await client.patch<Product>(API_ENDPOINTS.PRODUCTS.VIEW(id), {});
    } catch {
      return null;
    }
  },
});
