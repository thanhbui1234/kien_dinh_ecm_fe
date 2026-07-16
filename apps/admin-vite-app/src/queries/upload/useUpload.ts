import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { toast } from '@/utils/toast';

export type UploadInput = {
  file: File;
  bgOption?: 'none' | 'transparent' | 'cloudinary_white';
  onUploadProgress?: (progressEvent: any) => void;
};

export const useUpload = () => {
  return useMutation({
    mutationFn: async ({ file, bgOption = 'none', onUploadProgress }: UploadInput) => {
      const formData = new FormData();
      formData.append('file', file);
      if (bgOption) {
        formData.append('bgOption', bgOption);
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
