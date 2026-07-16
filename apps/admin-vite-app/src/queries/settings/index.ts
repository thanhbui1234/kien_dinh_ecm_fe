import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { settingKeys } from 'shared-api';
import { SystemSetting, Banner, Timeline, Slogan, PageMeta, UpdateSettingInput } from 'shared-api';

// System Settings
export const useSystemSettings = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.system(),
    queryFn: async () => {
      const response = await client.get<any, { data: SystemSetting[] }>(API_ENDPOINTS.SETTINGS.SYSTEM);
      return response.data;
    },
  });
};

export const useUpdateSystemSetting = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, data }: { key: string; data: UpdateSettingInput }) => {
      const response = await client.patch<any, { data: SystemSetting }>(API_ENDPOINTS.SETTINGS.SYSTEM_KEY(key), data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật cài đặt thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.system() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

// Banners
export const useBanners = (params?: Record<string, any>) => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.banners(),
    queryFn: async () => {
      const response = await client.get<any, { data: Banner[] }>(
        API_ENDPOINTS.SETTINGS.BANNERS,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateBanner = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Banner>) => {
      const response = await client.post<any, { data: Banner }>(API_ENDPOINTS.SETTINGS.BANNERS, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm banner thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.banners() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateBanner = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Banner> }) => {
      const response = await client.patch<any, { data: Banner }>(`${API_ENDPOINTS.SETTINGS.BANNERS}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật banner thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.banners() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateBannerOrders = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (banners: { id: string; orderIndex: number }[]) => {
      const response = await client.patch<any, { data: Banner[] }>(`${API_ENDPOINTS.SETTINGS.BANNERS}/order`, { banners });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật thứ tự banner thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.banners() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useDeleteBanner = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Banner }>(`${API_ENDPOINTS.SETTINGS.BANNERS}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa banner thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.banners() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};



// Slogans
export const useSlogans = (params?: Record<string, any>) => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.slogans(),
    queryFn: async () => {
      const response = await client.get<any, { data: Slogan[] }>(
        API_ENDPOINTS.SETTINGS.SLOGANS,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateSlogan = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Slogan>) => {
      const response = await client.post<any, { data: Slogan }>(API_ENDPOINTS.SETTINGS.SLOGANS, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm slogan thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.slogans() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateSlogan = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Slogan> }) => {
      const response = await client.patch<any, { data: Slogan }>(`${API_ENDPOINTS.SETTINGS.SLOGANS}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật slogan thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.slogans() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateSloganOrders = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slogans: { id: string; orderIndex: number }[]) => {
      const response = await client.patch<any, { data: Slogan[] }>(`${API_ENDPOINTS.SETTINGS.SLOGANS}/order`, { slogans });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật thứ tự slogan thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.slogans() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useDeleteSlogan = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Slogan }>(`${API_ENDPOINTS.SETTINGS.SLOGANS}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa slogan thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.slogans() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

// Timelines
export const useTimelines = (params?: Record<string, any>) => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.timelines(),
    queryFn: async () => {
      const response = await client.get<any, { data: Timeline[] }>(
        API_ENDPOINTS.SETTINGS.TIMELINES,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useCreateTimeline = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Timeline>) => {
      const response = await client.post<any, { data: Timeline }>(API_ENDPOINTS.SETTINGS.TIMELINES, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm timeline thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.timelines() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateTimeline = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Timeline> }) => {
      const response = await client.patch<any, { data: Timeline }>(`${API_ENDPOINTS.SETTINGS.TIMELINES}/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật timeline thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.timelines() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useUpdateTimelineOrders = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (timelines: { id: string; orderIndex: number }[]) => {
      const response = await client.patch<any, { data: Timeline[] }>(`${API_ENDPOINTS.SETTINGS.TIMELINES}/order`, { timelines });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật thứ tự timeline thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.timelines() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useDeleteTimeline = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.delete<any, { data: Timeline }>(`${API_ENDPOINTS.SETTINGS.TIMELINES}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa timeline thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.timelines() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
