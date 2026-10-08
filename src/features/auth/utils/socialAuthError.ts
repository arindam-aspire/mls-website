import type { ApiError } from "@/src/apis/core/error.normalizer";

const SOCIAL_ERROR_KEYS = {
  SOCIAL_ROLE_REQUIRED: "roleRequired",
  SOCIAL_ROLE_NOT_ALLOWED: "roleNotAllowed",
  SOCIAL_EMAIL_ALREADY_REGISTERED: "emailAlreadyRegistered",
  SOCIAL_TOKEN_EXPIRED: "tokenExpired",
  SOCIAL_TOKEN_INVALID: "tokenInvalid",
  SOCIAL_TOKEN_MISSING: "tokenInvalid",
  SOCIAL_PROVIDER_NOT_CONFIGURED: "notConfigured",
  SOCIAL_PROVIDER_UNAVAILABLE: "providerUnavailable",
  SOCIAL_PROVIDER_UNSUPPORTED: "failedDescription",
  SOCIAL_PROFILE_INCOMPLETE: "profileIncomplete",
  SOCIAL_EMAIL_NOT_VERIFIED: "profileIncomplete",
  SOCIAL_IDENTITY_CONFLICT: "identityConflict",
  SOCIAL_ACCOUNT_UNAVAILABLE: "accountUnavailable",
  NETWORK_ERROR: "network",
  TIMEOUT: "network",
} as const;

type SocialErrorKey = (typeof SOCIAL_ERROR_KEYS)[keyof typeof SOCIAL_ERROR_KEYS];

export function readSocialErrorCode(error: ApiError): string | null {
  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    return error.code;
  }

  const details = error.details;
  if (!details || typeof details !== "object") {
    return null;
  }

  const record = details as Record<string, unknown>;
  if (typeof record.code === "string" && record.code.trim()) {
    return record.code;
  }

  const detail = record.detail;
  if (detail && typeof detail === "object") {
    const code = (detail as { code?: unknown }).code;
    if (typeof code === "string" && code.trim()) {
      return code;
    }
  }

  return null;
}

export function socialAuthMessageKey(code: string | null): SocialErrorKey | null {
  if (!code) return null;
  return SOCIAL_ERROR_KEYS[code as keyof typeof SOCIAL_ERROR_KEYS] ?? null;
}

export function resolveSocialAuthErrorMessage(
  error: ApiError,
  translate: (key: SocialErrorKey | "failedDescription") => string,
): string {
  const key = socialAuthMessageKey(readSocialErrorCode(error));
  if (key) {
    return translate(key);
  }

  if (error.status === 409) {
    return translate("emailAlreadyRegistered");
  }

  if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
    return translate("network");
  }

  return error.message.trim() || translate("failedDescription");
}
