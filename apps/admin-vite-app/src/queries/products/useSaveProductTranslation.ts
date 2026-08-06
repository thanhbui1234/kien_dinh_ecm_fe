import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS, productKeys } from 'shared-api';
import { triggerRevalidate } from '@/utils/revalidate';

interface ProductTranslationPayload {
  productId: string;
  lang: string;
  name: string;
  slug?: string;
  contentDetail?: string;
  specifications?: Record<string, string>;
  features?: Record<string, string>;
}

export const useSaveProductTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, ...data }: ProductTranslationPayload) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PRODUCTS.TRANSLATION(productId),
        data
      );
      return response.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      triggerRevalidate('products');
    },
  });
};
