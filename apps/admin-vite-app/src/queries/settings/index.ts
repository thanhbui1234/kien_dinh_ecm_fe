import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { settingKeys } from 'shared-api';
import { SystemSetting, Banner, Timeline, Slogan, PageMeta, UpdateSettingInput, ContactSetting, UpdateContactSettingInput, FooterSetting, UpdateFooterSettingInput } from 'shared-api';
import { triggerRevalidate } from '@/utils/revalidate';

// ─── Translation input types ──────────────────────────────────────────────────
export interface SloganTranslationInput { lang: 'VI' | 'EN'; title: string; description?: string }
export interface BannerTranslationInput { lang: 'VI' | 'EN'; title?: string; description?: string }
export interface ContactTranslationInput { lang: 'VI' | 'EN'; title: string; description: string; address?: string; workingHours?: string }
export interface FooterTranslationInput { lang: 'VI' | 'EN'; introText: string; address?: string; customerSupportTitle?: string; customerSupportLinks?: { label: string; href: string }[] }

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
      triggerRevalidate('system-settings');
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

export const useBannersEN = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.banners('EN'),
    queryFn: async () => {
      const response = await client.get<any, { data: Banner[] }>(
        API_ENDPOINTS.SETTINGS.BANNERS,
        { params: { lang: 'EN' } }
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
      triggerRevalidate('banners');
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
      triggerRevalidate('banners');
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
      triggerRevalidate('banners');
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
      triggerRevalidate('banners');
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
      triggerRevalidate('slogans');
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
      triggerRevalidate('slogans');
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
      triggerRevalidate('slogans');
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
      triggerRevalidate('slogans');
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
      triggerRevalidate('timelines');
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
      triggerRevalidate('timelines');
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
      triggerRevalidate('timelines');
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
      triggerRevalidate('timelines');
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

// Contact Setting
export const useContactSetting = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.contact(),
    queryFn: async () => {
      const response = await client.get<any, { data: ContactSetting }>(API_ENDPOINTS.CONTACT_SETTING.BASE);
      return response.data;
    },
  });
};

export const useContactSettingEN = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.contact('EN'),
    queryFn: async () => {
      const response = await client.get<any, { data: ContactSetting }>(API_ENDPOINTS.CONTACT_SETTING.BASE, { params: { lang: 'EN' } });
      return response.data;
    },
  });
};

export const useUpdateContactSetting = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateContactSettingInput) => {
      const response = await client.patch<any, { data: ContactSetting }>(API_ENDPOINTS.CONTACT_SETTING.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật thông tin liên hệ thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.contact() });
      triggerRevalidate('contact-setting');
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

// Footer Setting
export const useFooterSetting = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.footer(),
    queryFn: async () => {
      const response = await client.get<any, { data: FooterSetting }>(API_ENDPOINTS.FOOTER_SETTING.BASE);
      return response.data;
    },
  });
};

export const useFooterSettingEN = () => {
  const client = axiosInstance;
  return useQuery({
    queryKey: settingKeys.footer('EN'),
    queryFn: async () => {
      const response = await client.get<any, { data: FooterSetting }>(API_ENDPOINTS.FOOTER_SETTING.BASE, { params: { lang: 'EN' } });
      return response.data;
    },
  });
};

export const useUpdateFooterSetting = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateFooterSettingInput) => {
      const response = await client.patch<any, { data: FooterSetting }>(API_ENDPOINTS.FOOTER_SETTING.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cập nhật cấu hình Footer thành công");
      queryClient.invalidateQueries({ queryKey: settingKeys.footer() });
      triggerRevalidate('footer-setting');
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

// ─── Translation Hooks ────────────────────────────────────────────────────────

export const useSaveSloganTranslation = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SloganTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.SETTINGS.SLOGAN_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      triggerRevalidate('slogans');
    },
    onError: (error: any) => { toast.error(error); },
  });
};

export const useSaveBannerTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BannerTranslationInput }) => {
      const res = await axiosInstance.post(API_ENDPOINTS.SETTINGS.BANNER_TRANSLATION(id), data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh thành công');
      queryClient.invalidateQueries({ queryKey: settingKeys.banners('EN') });
      triggerRevalidate('banners');
    },
    onError: (error: any) => { toast.error(error); },
  });
};

export const useSaveContactTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ContactTranslationInput) => {
      const res = await axiosInstance.post(API_ENDPOINTS.CONTACT_SETTING.TRANSLATION, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh liên hệ thành công');
      queryClient.invalidateQueries({ queryKey: settingKeys.contact('EN') });
      triggerRevalidate('contact-setting');
    },
    onError: (error: any) => { toast.error(error); },
  });
};

export const useSaveFooterTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FooterTranslationInput) => {
      const res = await axiosInstance.post(API_ENDPOINTS.FOOTER_SETTING.TRANSLATION, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Lưu bản dịch Tiếng Anh footer thành công');
      queryClient.invalidateQueries({ queryKey: settingKeys.footer('EN') });
      triggerRevalidate('footer-setting');
    },
    onError: (error: any) => { toast.error(error); },
  });
};
