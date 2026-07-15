import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { projectKeys } from '../../../shared/keys/projects.keys';
import { Project, CreateProjectInput, UpdateProjectInput, PageMeta } from '../../../shared/schemas';

export const useProjects = (params?: Record<string, any>) => {
  const client = useApiClient();
  return useQuery({
    queryKey: projectKeys.list(params || {}),
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Project[]; meta: PageMeta } }>(
        API_ENDPOINTS.PROJECTS.BASE,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProjectDetail = (id: string) => {
  const client = useApiClient();
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<any, { data: Project }>(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await client.post<any, { data: Project }>(API_ENDPOINTS.PROJECTS.BASE, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
  });
};

export const useUpdateProject = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectInput }) => {
      const response = await client.patch<any, { data: Project }>(API_ENDPOINTS.PROJECTS.DETAIL(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
  });
};

export const useDeleteProject = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Project }>(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: projectKeys.lists() }),
  });
};
