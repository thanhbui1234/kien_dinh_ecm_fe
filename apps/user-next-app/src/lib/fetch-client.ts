export interface FetchClientConfig {
  baseURL: string;
  defaultHeaders?: HeadersInit;
  getAccessToken?: () => string | null | Promise<string | null>;
}

export class FetchError extends Error {
  public response: Response;
  public data: any;
  public errorCode?: string;

  constructor(response: Response, data: any) {
    super(`FetchError: ${response.status} ${response.statusText}`);
    this.response = response;
    this.data = data;
    if (data && typeof data === 'object' && 'errorCode' in data) {
      this.errorCode = data.errorCode;
    }
  }
}

export const createFetchClient = (config: FetchClientConfig) => {
  const request = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${config.baseURL}${endpoint}`;
    
    const headers = new Headers(config.defaultHeaders);
    headers.set('Content-Type', 'application/json');

    if (config.getAccessToken) {
      const token = await config.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    if (options.headers) {
      const customHeaders = new Headers(options.headers);
      customHeaders.forEach((value, key) => headers.set(key, value));
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, fetchOptions);

    // Xử lý response json an toàn
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new FetchError(response, data);
    }

    if (data && typeof data === 'object' && 'data' in data) {
      return data.data as T;
    }

    return data as T;
  };

  return {
    get: <T = any>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T = any>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
    patch: <T = any>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
    put: <T = any>(endpoint: string, body: any, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T = any>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { ...options, method: 'DELETE' }),
    request,
  };
};

export type FetchClient = ReturnType<typeof createFetchClient>;
