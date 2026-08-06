import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, categoryKeys } from 'shared-api';
import { triggerRevalidate } from '@/utils/revalidate';

interface CategoryTranslationPayload {
  categoryId: string;
  lang: string;
  name: string;
  slug?: string;
}

export const useSaveCategoryTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ categoryId, ...data }: CategoryTranslationPayload) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CATEGORIES.TRANSLATION(categoryId),
        data
      );
      return response.data;
    },
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(categoryId) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      triggerRevalidate('categories');
    },
  });
};
