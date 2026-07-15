import axios, { type AxiosError } from "axios";

export type NormalizedApiErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "FORBIDDEN"
  | "SERVER_ERROR"
  | "UNKNOWN";

export type ApiError = {
  code: NormalizedApiErrorCode | number;
  message: string;
  status?: number;
  details?: unknown;
};

const NORMALIZED_MESSAGES: Record<
  Exclude<NormalizedApiErrorCode, "UNKNOWN">,
  string
> = {
  NETWORK_ERROR: "Network error. Check your connection and try again.",
  TIMEOUT: "The request timed out. Please try again.",
  FORBIDDEN: "You do not have permission to access this resource.",
  SERVER_ERROR: "Something went wrong on the server. Please try again later.",
};

function extractMessageFromRecord(record: Record<string, unknown>): string | undefined {
  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  if (typeof record.detail === "string" && record.detail.trim()) {
    return record.detail;
  }

  // FastAPI HTTPException: `{ detail: { code, message } }`
  if (record.detail && typeof record.detail === "object") {
    const detail = record.detail as Record<string, unknown>;
    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }
  }

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0];
    if (typeof first === "string" && first.trim()) {
      return first;
    }
    if (first && typeof first === "object" && "message" in first) {
      const message = (first as { message?: unknown }).message;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  return undefined;
}

function extractResponseMessage(data: unknown): string | undefined {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  return extractMessageFromRecord(data as Record<string, unknown>);
}

function resolveNormalizedCode(status: number): "FORBIDDEN" | "SERVER_ERROR" | null {
  if (status === 403) {
    return "FORBIDDEN";
  }
  if (status >= 500) {
    return "SERVER_ERROR";
  }
  return null;
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;

    if (axiosError.code === "ECONNABORTED") {
      return {
        code: "TIMEOUT",
        message: NORMALIZED_MESSAGES.TIMEOUT,
        details: axiosError.response?.data,
      };
    }

    if (!axiosError.response) {
      return {
        code: "NETWORK_ERROR",
        message: NORMALIZED_MESSAGES.NETWORK_ERROR,
        details: axiosError.message,
      };
    }

    const status = axiosError.response.status;
    const normalizedCode = resolveNormalizedCode(status);
    const responseMessage = extractResponseMessage(axiosError.response.data);

    if (normalizedCode) {
      return {
        code: normalizedCode,
        message: responseMessage ?? NORMALIZED_MESSAGES[normalizedCode],
        status,
        details: axiosError.response.data,
      };
    }

    const message =
      responseMessage ??
      axiosError.message ??
      "Request failed.";

    return {
      code: status,
      message,
      status,
      details: axiosError.response.data,
    };
  }

  if (isApiError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unexpected error occurred.",
  };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    (typeof (value as ApiError).code === "string" ||
      typeof (value as ApiError).code === "number") &&
    typeof (value as ApiError).message === "string"
  );
}
