import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Project } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createProjectsApi = (client: FetchClient) => ({
  getProjects: createListResource<Project>(client, API_ENDPOINTS.PROJECTS.BASE),
  getProjectDetail: createDetailResource<Project>(client, API_ENDPOINTS.PROJECTS.DETAIL),
});
