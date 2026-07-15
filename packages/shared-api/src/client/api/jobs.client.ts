import { FetchClient } from '../../core/fetch-client';
import { API_ENDPOINTS } from '../../shared/constants';
import { Job } from '../../shared/schemas';
import { createListResource, createDetailResource } from './resource-factory';

export const createJobsApi = (client: FetchClient) => ({
  getJobs: createListResource<Job>(client, API_ENDPOINTS.JOBS.BASE),
  getJobDetail: createDetailResource<Job>(client, API_ENDPOINTS.JOBS.DETAIL_SLUG),
});
