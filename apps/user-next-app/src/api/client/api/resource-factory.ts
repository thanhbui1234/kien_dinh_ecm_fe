import { FetchClient } from '@/lib/fetch-client';
import { DEFAULT_PAGINATION } from 'shared-api';
import { PageMeta } from 'shared-api';

// Factory cho một hàm lấy danh sách (có phân trang)
// Sử dụng safeGet: tự bắt lỗi + log, trả null nếu API fail
export const createListResource = <T>(client: FetchClient, basePath: string) => {
  return async (
    searchParams?: Record<string, string>,
    options?: RequestInit
  ): Promise<{ items: T[]; meta: PageMeta } | null> => {
    const queryParams = { ...DEFAULT_PAGINATION, ...searchParams };
    const query = new URLSearchParams(queryParams).toString();
    const url = query ? `${basePath}?${query}` : basePath;
    return await client.safeGet<{ items: T[]; meta: PageMeta }>(url, options);
  };
};

// Factory cho một hàm lấy chi tiết
// Sử dụng safeGet: tự bắt lỗi + log, trả null nếu API fail
export const createDetailResource = <T>(client: FetchClient, endpointFn: (id: string) => string) => {
  return async (id: string, options?: RequestInit): Promise<T | null> => {
    return await client.safeGet<T>(endpointFn(id), options);
  };
};

// Factory cho một hàm lấy danh sách đơn giản (không phân trang, trả về array)
// Sử dụng safeGet: tự bắt lỗi + log, trả null nếu API fail
export const createSimpleListResource = <T>(client: FetchClient, basePath: string) => {
  return async (options?: RequestInit): Promise<T[] | null> => {
    return await client.safeGet<T[]>(basePath, options);
  };
};
