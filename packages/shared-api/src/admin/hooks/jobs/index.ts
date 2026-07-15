import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { jobKeys } from '../../../shared/keys/jobs.keys';
import { Job, CreateJobInput, UpdateJobInput, PageMeta } from '../../../shared/schemas';

export const useJobs = (params?: Record<string, any>) => {
  const client = useApiClient();
  return useQuery({
    queryKey: jobKeys.list(params || {}),
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Job[]; meta: PageMeta } }>(
        API_ENDPOINTS.JOBS.BASE,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useJobDetail = (id: string) => {
  const client = useApiClient();
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<any, { data: Job }>(API_ENDPOINTS.JOBS.DETAIL_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateJobInput) => {
      const response = await client.post<any, { data: Job }>(API_ENDPOINTS.JOBS.BASE, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobKeys.lists() }),
  });
};

export const useUpdateJob = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobInput }) => {
      const response = await client.patch<any, { data: Job }>(API_ENDPOINTS.JOBS.DETAIL_ID(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(variables.id) });
    },
  });
};

export const useDeleteJob = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Job }>(API_ENDPOINTS.JOBS.DETAIL_ID(id));
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: jobKeys.lists() }),
  });
};
