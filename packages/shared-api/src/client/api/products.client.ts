import { FetchClient } from '@api/core/fetch-client';
import { API_ENDPOINTS } from '@api/shared/constants';
import { Product } from '@api/shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createProductsApi = (client: FetchClient) => ({
  getProducts: createListResource<Product>(client, API_ENDPOINTS.PRODUCTS.BASE),
  getProductDetail: createDetailResource<Product>(client, API_ENDPOINTS.PRODUCTS.DETAIL),
});
