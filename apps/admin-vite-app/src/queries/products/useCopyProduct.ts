import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, productKeys, Product } from 'shared-api';

export const useCopyProduct = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.post<any, { data: Product }>(
        API_ENDPOINTS.PRODUCTS.COPY(id)
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Sao chép sản phẩm thành công');
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    },
  });
};
