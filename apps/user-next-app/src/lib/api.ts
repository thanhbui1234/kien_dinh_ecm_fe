import { ClientApi, createFetchClient } from 'shared-api';

// 1. Khởi tạo lõi Fetch (Cấu hình domain, token...)
export const fetchClient = createFetchClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  getAccessToken: () => {
    // Lấy token phía Client
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }
});

// 2. Khởi tạo MỘT object SDK duy nhất bao gồm tất cả API
export const api = ClientApi.createApiClient(fetchClient);

