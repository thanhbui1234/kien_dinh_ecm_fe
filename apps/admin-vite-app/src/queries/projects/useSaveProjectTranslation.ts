import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, projectKeys } from 'shared-api';
import { triggerRevalidate } from '@/utils/revalidate';

interface ProjectTranslationPayload {
  projectId: string;
  lang: string;
  name: string;
  slug?: string;
  description?: string;
  contentDetail?: string;
}

export const useSaveProjectTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, ...data }: ProjectTranslationPayload) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PROJECTS.TRANSLATION(projectId),
        data
      );
      return response.data;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      triggerRevalidate('projects');
    },
  });
};
