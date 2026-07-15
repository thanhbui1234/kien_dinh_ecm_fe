import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { leadKeys } from '../../../shared/keys/leads.keys';
import { Lead, UpdateLeadStatusInput, PageMeta } from '../../../shared/schemas';

export const useLeads = (params?: Record<string, any>) => {
  const client = useApiClient();
  return useQuery({
    queryKey: leadKeys.list(params || {}),
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Lead[]; meta: PageMeta } }>(
        API_ENDPOINTS.LEADS.BASE,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useUpdateLeadStatus = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadStatusInput }) => {
      const response = await client.patch<any, { data: Lead }>(API_ENDPOINTS.LEADS.STATUS(id), data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.lists() }),
  });
};
