import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

export interface AxiosClientConfig {
  baseURL: string;
  getAccessToken: () => string | null | Promise<string | null>;
  getRefreshToken: () => string | null | Promise<string | null>;
  onTokenRefreshed: (tokens: { accessToken: string; refreshToken: string }) => void;
  onUnauthenticated: () => void;
  refreshEndpoint: string;
}

export const createAxiosClient = (config: AxiosClientConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
  }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };

  instance.interceptors.request.use(
    async (reqConfig: InternalAxiosRequestConfig) => {
      const token = await config.getAccessToken();
      if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Prevent infinite loops if refresh endpoint itself fails with 401
      if (originalRequest.url === config.refreshEndpoint) {
        config.onUnauthenticated();
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = 'Bearer ' + token;
              }
              return instance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = await config.getRefreshToken();
        if (!refreshToken) {
          isRefreshing = false;
          config.onUnauthenticated();
          return Promise.reject(error);
        }

        try {
          // Calling refresh directly using a clean axios instance to avoid interceptor loop
          const refreshRes = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
            `${config.baseURL}${config.refreshEndpoint}`,
            { refreshToken }
          );

          const newTokens = refreshRes.data.data;
          config.onTokenRefreshed(newTokens);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          }

          processQueue(null, newTokens.accessToken);
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          config.onUnauthenticated();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
