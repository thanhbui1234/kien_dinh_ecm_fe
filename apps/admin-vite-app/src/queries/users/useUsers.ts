import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, usersKeys, CreateAdminDto, ResetPasswordDto, USER_MESSAGES, UserRole } from 'shared-api';
import { toast } from '@/utils/toast';

export interface UserAdminItem {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isLocked: boolean;
  isOnline: boolean;
  deviceCount: number;
  activeSessionsCount: number;
  lastActiveAt: string | null;
  devices: string[];
  createdAt: string;
}

export type UserItem = UserAdminItem;

export const useUsersList = () => {
  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get<any, { data: UserAdminItem[] }>(API_ENDPOINTS.USERS.BASE);
      return response.data || [];
    },
    refetchInterval: 10000, // Tự động refetch mỗi 10 giây để cập nhật trạng thái Online/Session realtime
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CreateAdminDto) => {
      const response = await axiosInstance.post(API_ENDPOINTS.USERS.ADMIN, dto);
      return response.data;
    },
    onSuccess: () => {
      toast.success(USER_MESSAGES.CREATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error, USER_MESSAGES.CREATE_FAILED);
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: ResetPasswordDto }) => {
      const response = await axiosInstance.patch(API_ENDPOINTS.USERS.RESET_PASSWORD(id), dto);
      return response.data;
    },
    onSuccess: () => {
      toast.success(USER_MESSAGES.RESET_SUCCESS);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error, USER_MESSAGES.RESET_FAILED);
    },
  });
};

export const useKickUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.post(API_ENDPOINTS.USERS.KICK(id));
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || USER_MESSAGES.KICK_SUCCESS);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error, USER_MESSAGES.KICK_FAILED);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success(data?.message || USER_MESSAGES.DELETE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error, USER_MESSAGES.DELETE_FAILED);
    },
  });
};
