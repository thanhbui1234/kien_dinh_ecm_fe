import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { toast } from '@/utils/toast';

export type UploadInput = {
  file: File;
  publicId?: string;
  onUploadProgress?: (progressEvent: any) => void;
};

export const useUpload = () => {
  return useMutation({
    mutationFn: async ({ file, publicId, onUploadProgress }: UploadInput) => {
      const formData = new FormData();
      formData.append('file', file);
      if (publicId) {
        formData.append('publicId', publicId);
      }

      const response = await axiosInstance.post<any, { data: { url: string } }>(
        API_ENDPOINTS.UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress,
        }
      );
      return response.data; // Should return UploadResponseDto which has url
    },
    onSuccess: () => {
      toast.success("Tải ảnh lên thành công");
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useGetFiles = (nextCursor?: string) => {
  return useQuery({
    queryKey: ['upload-files', nextCursor],
    queryFn: async () => {
      const url = nextCursor ? `${API_ENDPOINTS.UPLOAD}?nextCursor=${encodeURIComponent(nextCursor)}` : API_ENDPOINTS.UPLOAD;
      const response = await axiosInstance.get(url);
      return response.data;
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (publicId: string) => {
      const response = await axiosInstance.delete(API_ENDPOINTS.UPLOAD, {
        data: { publicId },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Xóa ảnh thành công");
      queryClient.invalidateQueries({ queryKey: ['upload-files'] });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
