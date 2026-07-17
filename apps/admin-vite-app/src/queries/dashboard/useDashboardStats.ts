import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';

export interface DashboardStat {
  date: string;
  leads: number;
  products: number;
}

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

export const useDashboardStats = () => {
  const client = axiosInstance;

  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await client.get<{ data: DashboardStat[] }>(API_ENDPOINTS.DASHBOARD.STATS);
      // Wait, is it response.data.data or response.data? Assuming response.data.data
      return response.data?.data || response.data;
    },
  });
};
