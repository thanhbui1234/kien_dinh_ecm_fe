import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { toast } from '@/utils/toast';
import { removeBackground } from '@imgly/background-removal';
import { getFileBgOption } from '@/utils/fileBgOption';

export type UploadInput = {
  file: File;
  publicId?: string;
  onUploadProgress?: (progressEvent: any) => void;
};

async function uploadRaw({ file, publicId, onUploadProgress }: UploadInput) {
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
}

function extractUploadUrl(res: any): string | null {
  const url = typeof res === 'string'
    ? res
    : res?.url || res?.data?.url || res?.secure_url || res?.data?.secure_url;
  return typeof url === 'string' ? url : null;
}

// Uploads a single file and resolves the final URL directly, without going
// through the mutation's onSuccess/onError toasts. Used to defer image
// uploads until a form's Save/Submit button is clicked.
export async function uploadFileAndGetUrl(input: UploadInput): Promise<string> {
  const res = await uploadRaw(input);
  const url = extractUploadUrl(res);
  if (!url) throw new Error('Không nhận được đường dẫn ảnh từ server.');
  return url;
}

// Runs the AI background-removal the user picked in FileUpload's dropdown
// (stored via setFileBgOption at selection time). Deferred to here — submit
// time — so the heavy AI call only ever runs once, right before upload.
async function applyBgOption(file: File): Promise<File> {
  const bgOption = getFileBgOption(file);
  if (bgOption === 'none') return file;

  try {
    const blob = await removeBackground(file);

    if (bgOption === 'transparent') {
      return new File([blob], file.name.replace(/\.[^/.]+$/, '') + '_transparent.png', { type: 'image/png' });
    }

    // cloudinary_white: composite the transparent cutout onto a white canvas
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    await new Promise((resolve) => { img.onload = resolve; });

    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const whiteBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
    if (!whiteBlob) return file;

    return new File([whiteBlob], file.name.replace(/\.[^/.]+$/, '') + '_white.jpg', { type: 'image/jpeg' });
  } catch (error) {
    console.error('Lỗi xóa nền AI:', error);
    toast.error(null, 'Xử lý nền thất bại, hệ thống sẽ sử dụng ảnh gốc.');
    return file;
  }
}

// Resolves a form field's image value at submit time: applies any pending AI
// background-removal choice and uploads it if it's still a pending File, or
// passes an already-uploaded URL through unchanged.
export async function resolveImageValue(value: string | File | null | undefined): Promise<string> {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const processed = await applyBgOption(value);
  return uploadFileAndGetUrl({ file: processed });
}

export async function resolveImageValues(values: (string | File)[]): Promise<string[]> {
  return Promise.all(values.map((v) => resolveImageValue(v)));
}

export const useUpload = () => {
  return useMutation({
    mutationFn: uploadRaw,
    onSuccess: () => {
      toast.success("Tải ảnh lên thành công");
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};

export const useGetFiles = (nextCursor?: string, enabled = true) => {
  return useQuery({
    queryKey: ['upload-files', nextCursor],
    enabled,
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
