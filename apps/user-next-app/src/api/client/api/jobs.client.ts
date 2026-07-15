import { FetchClient } from '@/lib/fetch-client';
import { API_ENDPOINTS } from 'shared-api';
import { Job } from 'shared-api';
import { createListResource, createDetailResource } from './resource-factory';

export const createJobsApi = (client: FetchClient) => ({
  getJobs: createListResource<Job>(client, API_ENDPOINTS.JOBS.BASE),
  getJobDetail: createDetailResource<Job>(client, API_ENDPOINTS.JOBS.DETAIL_SLUG),
});
