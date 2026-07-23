import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import type { CompanyProfile, UpdateCompanyProfileInput, CompanyHistoryEvent } from 'shared-api';
import type { CompanyInfoItem, Facility } from '@/types/about';
import { triggerRevalidate } from '@/utils/revalidate';

const aboutKeys = {
  all: ['about'] as const,
  profile: () => [...aboutKeys.all, 'profile'] as const,
  historyEvents: () => [...aboutKeys.all, 'history-events'] as const,
  companyInfo: () => [...aboutKeys.all, 'company-info'] as const,
  facilities: () => [...aboutKeys.all, 'facilities'] as const,
};

// Company Profile

export const useCompanyProfile = () => {
  return useQuery({
    queryKey: aboutKeys.profile(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyProfile }>(API_ENDPOINTS.ABOUT.PROFILE);
      return res.data;
    },
  });
};

export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateCompanyProfileInput) => {
      const res = await axiosInstance.patch<any, { data: CompanyProfile }>(API_ENDPOINTS.ABOUT.PROFILE, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cap nhat thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.profile() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

// History Events

export const useHistoryEvents = () => {
  return useQuery({
    queryKey: aboutKeys.historyEvents(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyHistoryEvent[] }>(API_ENDPOINTS.ABOUT.HISTORY_EVENTS);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateHistoryEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CompanyHistoryEvent, 'id'>) => {
      const res = await axiosInstance.post<any, { data: CompanyHistoryEvent }>(API_ENDPOINTS.ABOUT.HISTORY_EVENTS, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Them cot moc thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.historyEvents() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateHistoryEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CompanyHistoryEvent> }) => {
      const res = await axiosInstance.patch<any, { data: CompanyHistoryEvent }>(
        API_ENDPOINTS.ABOUT.HISTORY_EVENT_DETAIL(id),
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cap nhat thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.historyEvents() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateHistoryEventOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (events: { id: string; orderIndex: number }[]) => {
      const res = await axiosInstance.patch<any, { data: CompanyHistoryEvent[] }>(
        `${API_ENDPOINTS.ABOUT.HISTORY_EVENTS}/order`,
        { events }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutKeys.historyEvents() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useDeleteHistoryEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete<any, { data: CompanyHistoryEvent }>(
        API_ENDPOINTS.ABOUT.HISTORY_EVENT_DETAIL(id)
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Da xoa cot moc');
      queryClient.invalidateQueries({ queryKey: aboutKeys.historyEvents() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

// Company Info

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: aboutKeys.companyInfo(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyInfoItem[] }>(API_ENDPOINTS.ABOUT.COMPANY_INFO);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CompanyInfoItem, 'id'>) => {
      const res = await axiosInstance.post<any, { data: CompanyInfoItem }>(API_ENDPOINTS.ABOUT.COMPANY_INFO, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Them thong tin thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CompanyInfoItem> }) => {
      const res = await axiosInstance.patch<any, { data: CompanyInfoItem }>(
        API_ENDPOINTS.ABOUT.COMPANY_INFO_DETAIL(id),
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cap nhat thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useDeleteCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete<any, { data: CompanyInfoItem }>(
        API_ENDPOINTS.ABOUT.COMPANY_INFO_DETAIL(id)
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Da xoa');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

// Facilities

export const useFacilities = () => {
  return useQuery({
    queryKey: aboutKeys.facilities(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: Facility[] }>(API_ENDPOINTS.ABOUT.FACILITIES);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Facility, 'id'>) => {
      const res = await axiosInstance.post<any, { data: Facility }>(API_ENDPOINTS.ABOUT.FACILITIES, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Them co so thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Facility> }) => {
      const res = await axiosInstance.patch<any, { data: Facility }>(
        API_ENDPOINTS.ABOUT.FACILITY_DETAIL(id),
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cap nhat co so thanh cong');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete<any, { data: Facility }>(
        API_ENDPOINTS.ABOUT.FACILITY_DETAIL(id)
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Da xoa co so');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};
