import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "./token.store";
import { refreshToken } from "./token.refresh";
import { navigateTo } from "@/src/utils/navigation.utils";

export function applyInterceptors(
  instance: AxiosInstance,
  useAuth: () => boolean,
) {
  instance.interceptors.request.use((config) => {
    if (!useAuth()) {
      return config;
    }

    if (!tokenStore.hasAuthCredentials()) {
      navigateTo("/");
      return Promise.reject(new Error("Unauthorized: missing tokens"));
    }

    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.withCredentials = true;

    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        useAuth() &&
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        if (!tokenStore.canRefreshSession()) {
          navigateTo("/");
          return Promise.reject(error);
        }

        const refreshed = await refreshToken();
        if (refreshed) {
          const accessToken = tokenStore.getAccessToken();
          if (accessToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return instance(originalRequest);
        }

        navigateTo("/");
      }

      return Promise.reject(error);
    },
  );
}
