import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Project } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createProjectsApi = (client: FetchClient) => ({
  getProjects: (params?: Record<string, string>, options?: RequestInit) => {
    const listResource = createListResource<Project>(client, API_ENDPOINTS.PROJECTS.BASE);
    return listResource(params, { ...options, next: { tags: ['projects'] } } as any);
  },
  getProjectDetail: (id: string, options?: RequestInit) => {
    const detailResource = createDetailResource<Project>(client, API_ENDPOINTS.PROJECTS.DETAIL);
    return detailResource(id, { ...options, next: { tags: ['projects'] } } as any);
  },
});
