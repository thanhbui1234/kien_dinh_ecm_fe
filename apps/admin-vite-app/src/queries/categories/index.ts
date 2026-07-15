import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { categoryKeys } from 'shared-api';
import { Category, CreateCategoryInput, UpdateCategoryInput, PageMeta } from 'shared-api';

export const useCategories = (params?: Record<string, any>) => {
  const client = axiosInstance;
  return useQuery({
    queryKey: categoryKeys.list(params || {}),
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Category[]; meta: PageMeta } }>(
        API_ENDPOINTS.CATEGORIES.BASE,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCategoryDetail = (id: string) => {
  const client = axiosInstance;
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<any, { data: Category }>(API_ENDPOINTS.CATEGORIES.DETAIL(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCategoryInput) => {
      const response = await client.post<any, { data: Category }>(API_ENDPOINTS.CATEGORIES.BASE, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
};

export const useUpdateCategory = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryInput }) => {
      const response = await client.patch<any, { data: Category }>(API_ENDPOINTS.CATEGORIES.DETAIL(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Category }>(API_ENDPOINTS.CATEGORIES.DETAIL(id));
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
};
