import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { leadKeys } from 'shared-api';
import { Lead, UpdateLeadStatusInput, PageMeta } from 'shared-api';

export const useLeads = (params?: Record<string, any>) => {
  const client = axiosInstance;
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
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadStatusInput }) => {
      const response = await client.patch<any, { data: Lead }>(API_ENDPOINTS.LEADS.STATUS(id), data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateLead = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Lead> }) => {
      const response = await client.patch<any, { data: Lead }>(API_ENDPOINTS.LEADS.DETAIL(id), data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật liên hệ thành công");
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
