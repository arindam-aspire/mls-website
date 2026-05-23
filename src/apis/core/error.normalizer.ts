import axios, { type AxiosError } from "axios";

export function normalizeAxiosError(error: unknown): unknown {
  if (axios.isAxiosError(error)) {
    return (error as AxiosError).response?.data ?? error;
  }

  return error;
}



/* OLD CODE ---------------------------------------------------------------------------- */


// import axios, { type AxiosError } from "axios";

// export type ApiErrorCode =
//   | "NETWORK_ERROR"
//   | "TIMEOUT"
//   | "UNAUTHORIZED"
//   | "FORBIDDEN"
//   | "NOT_FOUND"
//   | "VALIDATION_ERROR"
//   | "SERVER_ERROR"
//   | "UNKNOWN";

// export type ApiError = {
//   code: ApiErrorCode;
//   message: string;
//   status?: number;
//   details?: unknown;
// };

// function extractResponseMessage(data: unknown): string | undefined {
//   if (!data || typeof data !== "object") {
//     return undefined;
//   }

//   const record = data as Record<string, unknown>;

//   if (typeof record.message === "string") {
//     return record.message;
//   }

//   if (typeof record.detail === "string") {
//     return record.detail;
//   }

//   if (Array.isArray(record.errors) && record.errors.length > 0) {
//     const first = record.errors[0];
//     if (typeof first === "string") {
//       return first;
//     }
//     if (first && typeof first === "object" && "message" in first) {
//       const message = (first as { message?: unknown }).message;
//       if (typeof message === "string") {
//         return message;
//       }
//     }
//   }

//   return undefined;
// }

// function mapStatusToCode(status: number): ApiErrorCode {
//   if (status === 401) {
//     return "UNAUTHORIZED";
//   }
//   if (status === 403) {
//     return "FORBIDDEN";
//   }
//   if (status === 404) {
//     return "NOT_FOUND";
//   }
//   if (status === 422) {
//     return "VALIDATION_ERROR";
//   }
//   if (status >= 500) {
//     return "SERVER_ERROR";
//   }
//   return "UNKNOWN";
// }

// export function normalizeError(error: unknown): ApiError {
//   if (axios.isAxiosError(error)) {
//     const axiosError = error as AxiosError<unknown>;

//     if (axiosError.code === "ECONNABORTED") {
//       return {
//         code: "TIMEOUT",
//         message: "The request timed out. Please try again.",
//         details: axiosError.response?.data,
//       };
//     }

//     if (!axiosError.response) {
//       return {
//         code: "NETWORK_ERROR",
//         message: "Network error. Check your connection and try again.",
//         details: axiosError.message,
//       };
//     }

//     const status = axiosError.response.status;
//     const message =
//       extractResponseMessage(axiosError.response.data) ??
//       axiosError.message ??
//       "Request failed.";

//     return {
//       code: mapStatusToCode(status),
//       message,
//       status,
//       details: axiosError.response.data,
//     };
//   }

//   if (isApiError(error)) {
//     return error;
//   }

//   if (error instanceof Error) {
//     return {
//       code: "UNKNOWN",
//       message: error.message,
//     };
//   }

//   return {
//     code: "UNKNOWN",
//     message: "An unexpected error occurred.",
//   };
// }

// export function isApiError(value: unknown): value is ApiError {
//   return (
//     typeof value === "object" &&
//     value !== null &&
//     "code" in value &&
//     "message" in value &&
//     typeof (value as ApiError).code === "string" &&
//     typeof (value as ApiError).message === "string"
//   );
// }
