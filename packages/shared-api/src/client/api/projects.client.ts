import { FetchClient } from '@api/core/fetch-client';
import { API_ENDPOINTS } from '@api/shared/constants';
import { Project } from '@api/shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createProjectsApi = (client: FetchClient) => ({
  getProjects: createListResource<Project>(client, API_ENDPOINTS.PROJECTS.BASE),
  getProjectDetail: createDetailResource<Project>(client, API_ENDPOINTS.PROJECTS.DETAIL),
});
