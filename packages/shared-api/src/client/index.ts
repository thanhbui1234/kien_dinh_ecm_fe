import { FetchClient } from '../core/fetch-client';
import { createAuthApi } from './api/auth.client';
import { createProductsApi } from './api/products.client';
import { createCategoriesApi } from './api/categories.client';
import { createProjectsApi } from './api/projects.client';
import { createJobsApi } from './api/jobs.client';
import { createLeadsApi } from './api/leads.client';
import { createSettingsApi } from './api/settings.client';

export * from './api/auth.client';
export * from './api/products.client';
export * from './api/categories.client';
export * from './api/projects.client';
export * from './api/jobs.client';
export * from './api/leads.client';
export * from './api/settings.client';

export const createApiClient = (client: FetchClient) => ({
  auth: createAuthApi(client),
  products: createProductsApi(client),
  categories: createCategoriesApi(client),
  projects: createProjectsApi(client),
  jobs: createJobsApi(client),
  leads: createLeadsApi(client),
  settings: createSettingsApi(client),
});
