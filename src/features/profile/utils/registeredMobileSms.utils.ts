export class SmsApiFailureError extends Error {
  readonly code: string;
  readonly details: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = "SmsApiFailureError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Authenticated profile fields from `GET /auth/me`.
 * Verification is only `is_phone_verified === true`. A stored number is not proof.
 */
export type RegisteredMobileSmsUser = {
  phone_number?: string | null;
  is_phone_verified?: boolean | null;
} | null;

export type RegisteredMobileSmsBlockReason =
  | "unauthenticated"
  | "missing_phone"
  | "unverified";

export type RegisteredMobileSmsEligibility =
  | { allowed: true }
  | { allowed: false; reason: RegisteredMobileSmsBlockReason };

const INFRASTRUCTURE_MESSAGE =
  /aws|sns|botocore|credential|secret|stack trace|traceback|accessdenied/i;

const OTP_FIELD_KEYS = new Set([
  "otp",
  "dev_email_otp",
  "dev_phone_otp",
  "phone_otp",
  "email_otp",
]);

export function hasRegisteredMobileNumber(phoneNumber: unknown): boolean {
  return typeof phoneNumber === "string" && phoneNumber.trim().length > 0;
}

/** Only an explicit boolean true counts as verified. */
export function isRegisteredMobileVerified(status: unknown): boolean {
  return status === true;
}

export function resolveRegisteredMobileSmsEligibility(
  user: RegisteredMobileSmsUser | undefined,
): RegisteredMobileSmsEligibility {
  if (user == null) {
    return { allowed: false, reason: "unauthenticated" };
  }

  if (!hasRegisteredMobileNumber(user.phone_number)) {
    return { allowed: false, reason: "missing_phone" };
  }

  if (!isRegisteredMobileVerified(user.is_phone_verified)) {
    return { allowed: false, reason: "unverified" };
  }

  return { allowed: true };
}

function readErrorCode(value: unknown): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.code === "string" && record.code.trim()) {
    return record.code.trim();
  }

  if (record.detail && typeof record.detail === "object") {
    const nested = readErrorCode(record.detail);
    if (nested) return nested;
  }

  if (record.error && typeof record.error === "object") {
    const nested = readErrorCode(record.error);
    if (nested) return nested;
  }

  return null;
}

const TRANSPORT_CODES = new Set([
  "NETWORK_ERROR",
  "TIMEOUT",
  "FORBIDDEN",
  "SERVER_ERROR",
  "UNKNOWN",
]);

export function extractApiErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const record = error as Record<string, unknown>;
  if (typeof record.code === "string" && !TRANSPORT_CODES.has(record.code)) {
    return record.code.trim();
  }

  if (record.details != null) {
    const fromDetails = readErrorCode(record.details);
    if (fromDetails) return fromDetails;
  }

  return readErrorCode(record);
}

const UNVERIFIED_PHONE_API_CODES = new Set([
  "MOBILE_NOT_VERIFIED",
  "PHONE_NOT_VERIFIED",
]);

export function isMobileNotVerifiedApiError(error: unknown): boolean {
  const code = extractApiErrorCode(error)?.toUpperCase();
  return code != null && UNVERIFIED_PHONE_API_CODES.has(code);
}

/** SMS requests are never retried. A `MOBILE_NOT_VERIFIED` response must not be sent again. */
export function shouldRetrySmsSend(_error: unknown): boolean {
  return false;
}

export function sanitizeSmsErrorMessage(
  message: string | null | undefined,
  genericMessage: string,
): string {
  const trimmed = message?.trim() ?? "";
  if (!trimmed || INFRASTRUCTURE_MESSAGE.test(trimmed)) {
    return genericMessage;
  }

  if (/otp|verification code|one-time/i.test(trimmed)) {
    return trimmed.replace(/\b\d{4,8}\b/g, "••••••");
  }

  return trimmed;
}

export function stripSensitiveSmsFields<T>(value: T): T {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => stripSensitiveSmsFields(entry)) as T;
  }

  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (OTP_FIELD_KEYS.has(key)) {
      continue;
    }
    next[key] =
      entry && typeof entry === "object" ? stripSensitiveSmsFields(entry) : entry;
  }

  return next as T;
}

export function createSmsApiFailure(payload: {
  code?: unknown;
  message?: string | null;
  error?: unknown;
  detail?: unknown;
  details?: unknown;
}): SmsApiFailureError {
  const code =
    (typeof payload.code === "string" && payload.code.trim()) ||
    readErrorCode(payload.detail) ||
    readErrorCode(payload.error) ||
    readErrorCode(payload.details) ||
    "UNKNOWN";

  return new SmsApiFailureError(
    code,
    payload.message?.trim() || "Failed to send message",
    stripSensitiveSmsFields(payload),
  );
}

export type RegisteredMobileSmsRequestResult<T> =
  | { status: "sent"; result: T }
  | { status: "blocked"; reason: RegisteredMobileSmsBlockReason }
  | { status: "busy" }
  | { status: "load_failed"; error: unknown };

/**
 * Loads the current user, stops when the registered mobile is missing or
 * unverified, and only then runs `send`. A second call while one is in
 * flight returns `busy` and does not call `send`.
 */
export async function requestRegisteredMobileSms<T>(params: {
  loadUser: () => Promise<RegisteredMobileSmsUser>;
  send: () => Promise<T>;
  lock: { tryEnter: () => boolean; leave: () => void };
}): Promise<RegisteredMobileSmsRequestResult<T>> {
  if (!params.lock.tryEnter()) {
    return { status: "busy" };
  }

  try {
    let user: RegisteredMobileSmsUser;
    try {
      user = await params.loadUser();
    } catch (error: unknown) {
      return { status: "load_failed", error };
    }

    const eligibility = resolveRegisteredMobileSmsEligibility(user);
    if (!eligibility.allowed) {
      return { status: "blocked", reason: eligibility.reason };
    }

    const result = await params.send();
    return { status: "sent", result };
  } finally {
    params.lock.leave();
  }
}

export function createSmsRequestLock() {
  let pending = false;

  return {
    tryEnter(): boolean {
      if (pending) return false;
      pending = true;
      return true;
    },
    leave(): void {
      pending = false;
    },
    get isPending(): boolean {
      return pending;
    },
  };
}
