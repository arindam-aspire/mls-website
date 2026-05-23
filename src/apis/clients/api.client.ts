import { createAxiosInstance } from "@/src/apis/core/axios.factory";
import { applyInterceptors } from "@/src/apis/core/axios.interceptor";
import { normalizeAxiosError } from "@/src/apis/core/error.normalizer";

export type ApiRequestConfig = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
};

export type ApiClientRequestConfig = Omit<ApiRequestConfig, "auth"> & {
  auth?: boolean;
};

export class BaseApiClient {
  static async request<T>(config: ApiRequestConfig): Promise<T> {
    const instance = createAxiosInstance(config.isFormData ?? false);

    applyInterceptors(instance, () => config.auth ?? true);

    try {
      const response = await instance.request<T>({
        url: config.endpoint,
        method: config.method,
        data: config.body,
      });

      return response.data;
    } catch (error: unknown) {
      throw normalizeAxiosError(error);
    }
  }
}

export const authClient = {
  request: <T>(config: ApiClientRequestConfig) => {
    const useAuth = config.auth ?? false;

    return BaseApiClient.request<T>({
      ...config,
      auth: useAuth,
    });
  },
};

export const apiClient = {
  request: <T>(config: ApiClientRequestConfig) => {
    const useAuth = config.auth ?? true;

    return BaseApiClient.request<T>({
      ...config,
      auth: useAuth,
    });
  },
};
