import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import type { CompanyInfoItem, Facility } from '@/types/about';

const aboutKeys = {
  all: ['about'] as const,
  companyInfo: () => [...aboutKeys.all, 'company-info'] as const,
  facilities: () => [...aboutKeys.all, 'facilities'] as const,
};

// ─── Company Info ���────────────────────────────────────────────────────────────

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: aboutKeys.companyInfo(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: CompanyInfoItem[] }>(
        API_ENDPOINTS.ABOUT.COMPANY_INFO
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateCompanyInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CompanyInfoItem, 'id'>) => {
      const res = await axiosInstance.post<any, { data: CompanyInfoItem }>(
        API_ENDPOINTS.ABOUT.COMPANY_INFO,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Thêm thông tin thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
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
      toast.success('Cập nhật thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
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
      toast.success('Đã xóa');
      queryClient.invalidateQueries({ queryKey: aboutKeys.companyInfo() });
    },
    onError: (error: any) => toast.error(error),
  });
};

// ─── Facilities ─────────────���─────────────────────────────��───────────────────

export const useFacilities = () => {
  return useQuery({
    queryKey: aboutKeys.facilities(),
    queryFn: async () => {
      const res = await axiosInstance.get<any, { data: Facility[] }>(
        API_ENDPOINTS.ABOUT.FACILITIES
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Facility, 'id'>) => {
      const res = await axiosInstance.post<any, { data: Facility }>(
        API_ENDPOINTS.ABOUT.FACILITIES,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success('Thêm cơ sở thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
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
      toast.success('Cập nhật cơ sở thành công');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
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
      toast.success('Đã xóa cơ sở');
      queryClient.invalidateQueries({ queryKey: aboutKeys.facilities() });
    },
    onError: (error: any) => toast.error(error),
  });
};
