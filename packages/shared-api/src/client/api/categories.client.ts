import { FetchClient } from '@api/core/fetch-client';
import { API_ENDPOINTS } from '@api/shared/constants';
import { Category } from '@api/shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createCategoriesApi = (client: FetchClient) => ({
  getCategories: createListResource<Category>(client, API_ENDPOINTS.CATEGORIES.BASE),
  getCategoryDetail: createDetailResource<Category>(client, API_ENDPOINTS.CATEGORIES.DETAIL),
});
