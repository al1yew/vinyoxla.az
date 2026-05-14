import axios, { AxiosError, type AxiosAdapter, type AxiosRequestConfig } from "axios";
import type { ApiError, Locale } from "./types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5222",
  withCredentials: true,
  timeout: 15000
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeApiError(error))
);

export function languageHeaders(locale: Locale) {
  return {
    "Accept-Language": locale
  };
}

export function normalizeApiError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data as Partial<ApiError> | undefined;

    return {
      status,
      code: data?.code || error.code || "network_error",
      message: data?.message || error.message || "Network error",
      details: data?.details
    };
  }

  if (error instanceof Error) {
    return {
      status: 0,
      code: "unknown_error",
      message: error.message
    };
  }

  return {
    status: 0,
    code: "unknown_error",
    message: "Unknown error"
  };
}

export function isApiError(value: unknown): value is ApiError {
  return Boolean(
    value &&
      typeof value === "object" &&
      "status" in value &&
      "code" in value &&
      "message" in value
  );
}

type MockFactory<T> = (config: AxiosRequestConfig) => Promise<T> | T;

export async function mockRequest<T>({
  locale,
  url,
  method = "GET",
  data,
  factory
}: {
  locale: Locale;
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  factory: MockFactory<T>;
}): Promise<T> {
  const adapter: AxiosAdapter = async (config) => {
    try {
      await delay(420);
      const responseData = await factory(config);

      return {
        data: responseData,
        status: 200,
        statusText: "OK",
        headers: {},
        config
      };
    } catch (error) {
      const apiError = normalizeApiError(error);

      return Promise.reject({
        isAxiosError: true,
        response: {
          data: apiError,
          status: apiError.status || 500,
          statusText: apiError.code,
          headers: {},
          config
        },
        config,
        message: apiError.message,
        name: "AxiosError"
      });
    }
  };

  const response = await apiClient.request<T>({
    url,
    method,
    data,
    adapter,
    headers: languageHeaders(locale)
  });

  return response.data;
}

export function createApiError(status: number, code: string, message: string, details?: unknown): ApiError {
  return {
    status,
    code,
    message,
    details
  };
}

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
