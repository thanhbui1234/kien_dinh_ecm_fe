import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Category } from 'shared-api';
import { createSimpleListResource, createDetailResource } from './resource-factory';

export const createCategoriesApi = (client: FetchClient) => ({
  getCategories: (options?: RequestInit) => {
    const listResource = createSimpleListResource<Category>(client, API_ENDPOINTS.CATEGORIES.BASE);
    return listResource({ ...options, next: { tags: ['categories'] } } as any);
  },
  getCategoryDetail: (id: string, options?: RequestInit) => {
    const detailResource = createDetailResource<Category>(client, API_ENDPOINTS.CATEGORIES.DETAIL);
    return detailResource(id, { ...options, next: { tags: ['categories'] } } as any);
  },
});
