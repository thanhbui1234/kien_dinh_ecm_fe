import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Category } from 'shared-api';
import { createSimpleListResource, createDetailResource } from './resource-factory';

export const createCategoriesApi = (client: FetchClient) => ({
  getCategories: createSimpleListResource<Category>(client, API_ENDPOINTS.CATEGORIES.BASE),
  getCategoryDetail: createDetailResource<Category>(client, API_ENDPOINTS.CATEGORIES.DETAIL),
});
