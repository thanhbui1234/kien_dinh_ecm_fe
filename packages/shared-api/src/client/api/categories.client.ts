import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { Category } from '../../shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createCategoriesApi = (client: FetchClient) => ({
  getCategories: createListResource<Category>(client, API_ENDPOINTS.CATEGORIES.BASE),
  getCategoryDetail: createDetailResource<Category>(client, API_ENDPOINTS.CATEGORIES.DETAIL),
});
