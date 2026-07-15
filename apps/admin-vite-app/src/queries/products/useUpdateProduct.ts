import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from 'shared-api';
import { productKeys } from 'shared-api';
import { UpdateProductInput, Product } from 'shared-api';

export const useUpdateProduct = () => {
  const client = axiosInstance;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductInput }) => {
      const response = await client.patch<any, { data: Product }>(API_ENDPOINTS.PRODUCTS.DETAIL(id), data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error);
    }
  });
};
