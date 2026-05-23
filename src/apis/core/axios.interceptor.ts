import { AxiosInstance } from 'axios';
import { tokenStore } from './token.store';
import { refreshToken } from './token.refresh';

export function applyInterceptors(
  instance: AxiosInstance,
  useAuth: () => boolean
) {
  instance.interceptors.request.use((config) => {
    if (useAuth()) {
      const accessToken = tokenStore.getAccess();
      const refreshTokenValue = tokenStore.getRefresh();

      // If auth is required but we don't have the necessary tokens,
      // treat it as unauthorized and redirect to home.
      if (!accessToken || !refreshTokenValue) {
        window.location.href = '/';
        return Promise.reject(new Error('Unauthorized: missing tokens'));
      }

      if (accessToken) {
        // Ensure headers object exists and is compatible with Axios typings
        const headers: any = config.headers ?? {};
        headers.Authorization = `Bearer ${accessToken}`;
        config.headers = headers;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (
        // Only attempt refresh for requests that actually use auth
        useAuth() &&
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const refreshed = await refreshToken();
        if (refreshed) {
          return instance(originalRequest);
        } else {
          // Refresh failed or no refresh token available – treat as unauthorized
          window.location.href = '/';
        }
      }

      return Promise.reject(error);
    }
  );
}
