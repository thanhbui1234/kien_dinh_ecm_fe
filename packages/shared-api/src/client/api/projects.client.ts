import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { Project } from '../../shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createProjectsApi = (client: FetchClient) => ({
  getProjects: createListResource<Project>(client, API_ENDPOINTS.PROJECTS.BASE),
  getProjectDetail: createDetailResource<Project>(client, API_ENDPOINTS.PROJECTS.DETAIL),
});
