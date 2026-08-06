import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, jobKeys } from 'shared-api';
import { triggerRevalidate } from '@/utils/revalidate';

interface JobSectionItem {
  title: string;
  content: string;
}

interface JobTranslationPayload {
  jobId: string;
  lang: string;
  title: string;
  slug?: string;
  salary?: string;
  sections?: JobSectionItem[];
}

export const useSaveJobTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, ...data }: JobTranslationPayload) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.JOBS.TRANSLATION(jobId),
        data
      );
      return response.data;
    },
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      triggerRevalidate('jobs');
    },
  });
};
