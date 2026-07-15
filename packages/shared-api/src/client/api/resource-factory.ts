import { FetchClient } from '@api/core/fetch-client';
import { DEFAULT_PAGINATION } from '@api/shared/constants';
import { PageMeta } from '@api/shared/schemas';

// Factory cho một hàm lấy danh sách (có phân trang)
export const createListResource = <T>(client: FetchClient, basePath: string) => {
  return async (
    searchParams?: Record<string, string>,
    options?: RequestInit
  ): Promise<{ items: T[]; meta: PageMeta }> => {
    const queryParams = { ...DEFAULT_PAGINATION, ...searchParams };
    const query = new URLSearchParams(queryParams).toString();
    const url = query ? `${basePath}?${query}` : basePath;
    return await client.get<{ items: T[]; meta: PageMeta }>(url, options);
  };
};

// Factory cho một hàm lấy chi tiết
export const createDetailResource = <T>(client: FetchClient, endpointFn: (id: string) => string) => {
  return async (id: string, options?: RequestInit): Promise<T> => {
    return await client.get<T>(endpointFn(id), options);
  };
};
