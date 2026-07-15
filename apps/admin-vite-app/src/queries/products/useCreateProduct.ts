import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { productKeys } from 'shared-api';
import { CreateProductInput, Product } from 'shared-api';

export const useCreateProduct = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const response = await client.post<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.BASE, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
