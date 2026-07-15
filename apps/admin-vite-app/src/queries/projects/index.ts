import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { projectKeys } from 'shared-api';
import { Project, CreateProjectInput, UpdateProjectInput, PageMeta } from 'shared-api';

export const useProjects = (params?: Record<string, any>) => {
  const client = axiosInstance;
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
  const client = axiosInstance;
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
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const response = await client.post<any, { data: Project }>(API_ENDPOINTS.PROJECTS.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm dự án thành công");
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateProject = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectInput }) => {
      const response = await client.patch<any, { data: Project }>(API_ENDPOINTS.PROJECTS.DETAIL(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Cập nhật dự án thành công");
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useDeleteProject = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Project }>(API_ENDPOINTS.PROJECTS.DETAIL(id));
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa dự án thành công");
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
