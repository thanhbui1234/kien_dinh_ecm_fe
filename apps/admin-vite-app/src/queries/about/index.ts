import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import type { CompanyProfile, UpdateCompanyProfileInput, CompanyHistoryEvent, CompanyLocation, CreateCompanyLocationInput, UpdateCompanyLocationInput } from 'shared-api';
import type { CompanyInfoItem, Facility } from '@/types/about';
import { triggerRevalidate } from '@/utils/revalidate';

// ─── Translation input types (inline — mirrors DTOs from dto-api) ─────────────
export interface ProfileTranslationInput { lang: 'VI' | 'EN'; introHtml: string }
export interface CompanyInfoTranslationInput { lang: 'VI' | 'EN'; label: string; value: string }
export interface FacilityTranslationInput { lang: 'VI' | 'EN'; name: string; country: string; address: string }
export interface HistoryEventTranslationInput { lang: 'VI' | 'EN'; period: string; text: string }
export interface LocationTranslationInput { lang: 'VI' | 'EN'; title: string; addressLabel: string; address: string }

const aboutKeys = {
  all: ['about'] as const,
  profile: (lang?: string) => lang ? [...aboutKeys.all, 'profile', lang] as const : [...aboutKeys.all, 'profile'] as const,
  historyEvents: (lang?: string) => lang ? [...aboutKeys.all, 'history-events', lang] as const : [...aboutKeys.all, 'history-events'] as const,
  companyInfo: (lang?: string) => lang ? [...aboutKeys.all, 'company-info', lang] as const : [...aboutKeys.all, 'company-info'] as const,
  facilities: (lang?: string) => lang ? [...aboutKeys.all, 'facilities', lang] as const : [...aboutKeys.all, 'facilities'] as const,
  locations: (lang?: string) => lang ? [...aboutKeys.all, 'locations', lang] as const : [...aboutKeys.all, 'locations'] as const,
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

export const useCompanyProfileEN = () => {
  return useQuery({
    queryKey: aboutKeys.profile('EN'),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyProfile }>(API_ENDPOINTS.ABOUT.PROFILE, { params: { lang: 'EN' } });
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

export const useHistoryEventsEN = () => {
  return useQuery({
    queryKey: aboutKeys.historyEvents('EN'),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyHistoryEvent[] }>(API_ENDPOINTS.ABOUT.HISTORY_EVENTS, { params: { lang: 'EN' } });
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

export const useCompanyInfoEN = () => {
  return useQuery({
    queryKey: aboutKeys.companyInfo('EN'),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyInfoItem[] }>(API_ENDPOINTS.ABOUT.COMPANY_INFO, { params: { lang: 'EN' } });
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

export const useFacilitiesEN = () => {
  return useQuery({
    queryKey: aboutKeys.facilities('EN'),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: Facility[] }>(API_ENDPOINTS.ABOUT.FACILITIES, { params: { lang: 'EN' } });
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

// Company Locations

export const useCompanyLocations = () => {
  return useQuery({
    queryKey: aboutKeys.locations(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyLocation[] }>(API_ENDPOINTS.ABOUT.LOCATIONS);
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCompanyLocationsEN = () => {
  return useQuery({
    queryKey: aboutKeys.locations('EN'),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyLocation[] }>(API_ENDPOINTS.ABOUT.LOCATIONS, { params: { lang: 'EN' } });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateCompanyLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCompanyLocationInput) => {
      const res = await axiosInstance.post<any, { data: CompanyLocation }>(API_ENDPOINTS.ABOUT.LOCATIONS, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Thêm vị trí thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.locations() });
      triggerRevalidate('about-locations');
    },
    onError: (error: any) => toast.error(error),
  });
};

// ─── Translation Hooks ────────────────────────────────────────────────────────

export const useSaveProfileTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileTranslationInput) => {
      const res = await axiosInstance.post(API_ENDPOINTS.ABOUT.PROFILE_TRANSLATION, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.profile('EN') });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useSaveCompanyInfoTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CompanyInfoTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.ABOUT.COMPANY_INFO_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo('EN') });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useSaveFacilityTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FacilityTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.ABOUT.FACILITY_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities('EN') });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useSaveHistoryEventTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: HistoryEventTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.ABOUT.HISTORY_EVENT_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.historyEvents('EN') });
      triggerRevalidate('about');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useSaveLocationTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LocationTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.ABOUT.LOCATION_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.locations('EN') });
      triggerRevalidate('about-locations');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateCompanyLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCompanyLocationInput }) => {
      const res = await axiosInstance.patch<any, { data: CompanyLocation }>(
        API_ENDPOINTS.ABOUT.LOCATION_DETAIL(id),
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Cập nhật vị trí thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.locations() });
      triggerRevalidate('about-locations');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useUpdateCompanyLocationOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (locations: { id: string; orderIndex: number }[]) => {
      const res = await axiosInstance.patch<any, { data: CompanyLocation[] }>(
        API_ENDPOINTS.ABOUT.LOCATIONS_ORDER,
        { locations }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aboutKeys.locations() });
      triggerRevalidate('about-locations');
    },
    onError: (error: any) => toast.error(error),
  });
};

export const useDeleteCompanyLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosInstance.delete<any, { data: CompanyLocation }>(
        API_ENDPOINTS.ABOUT.LOCATION_DETAIL(id)
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã xóa vị trí');
      queryClient.invalidateQueries({ queryKey: aboutKeys.locations() });
      triggerRevalidate('about-locations');
    },
    onError: (error: any) => toast.error(error),
  });
};

