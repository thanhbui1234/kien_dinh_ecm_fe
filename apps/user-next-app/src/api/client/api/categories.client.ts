import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Category } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createCategoriesApi = (client: FetchClient) => ({
  getCategories: createListResource<Category>(client, API_ENDPOINTS.CATEGORIES.BASE),
  getCategoryDetail: createDetailResource<Category>(client, API_ENDPOINTS.CATEGORIES.DETAIL),
});
