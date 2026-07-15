import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useApiClient } from '../../../core/ApiProvider';
import { API_ENDPOINTS } from '../../../shared/constants';
import { settingKeys } from '../../../shared/keys/settings.keys';
import { SystemSetting, Banner, Timeline, Slogan, PageMeta, UpdateSettingInput } from '../../../shared/schemas';

// System Settings
export const useSystemSettings = () => {
  const client = useApiClient();
  return useQuery({
    queryKey: settingKeys.system(),
    queryFn: async () => {
      const response = await client.get<any, { data: SystemSetting[] }>(API_ENDPOINTS.SETTINGS.SYSTEM);
      return response.data;
    },
  });
};

export const useUpdateSystemSetting = () => {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, data }: { key: string; data: UpdateSettingInput }) => {
      const response = await client.patch<any, { data: SystemSetting }>(API_ENDPOINTS.SETTINGS.SYSTEM_KEY(key), data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: settingKeys.system() }),
  });
};

// Banners
export const useBanners = (params?: Record<string, any>) => {
  const client = useApiClient();
  return useQuery({
    queryKey: settingKeys.banners(), // Assuming banners don't have complex list params in admin
    queryFn: async () => {
      const response = await client.get<any, { data: { items: Banner[]; meta: PageMeta } }>(
        API_ENDPOINTS.SETTINGS.BANNERS,
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};

// ... Similar hooks can be added here for Timelines, Slogans when needed
