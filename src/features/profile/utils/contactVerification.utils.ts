import type { ContactVerificationChannel } from "../types/profile.types";

const TRANSPORT_CODES = new Set([
  "NETWORK_ERROR",
  "TIMEOUT",
  "FORBIDDEN",
  "SERVER_ERROR",
  "UNKNOWN",
]);

function readAlreadyVerifiedCode(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;

  const record = error as Record<string, unknown>;
  if (typeof record.code === "string" && record.code.trim()) {
    const code = record.code.trim();
    if (!TRANSPORT_CODES.has(code)) return code;
  }

  const details = record.details;
  if (details && typeof details === "object") {
    const nested = details as Record<string, unknown>;
    if (typeof nested.code === "string" && nested.code.trim()) {
      return nested.code.trim();
    }
    if (nested.detail && typeof nested.detail === "object") {
      const detail = nested.detail as Record<string, unknown>;
      if (typeof detail.code === "string" && detail.code.trim()) {
        return detail.code.trim();
      }
    }
  }

  return null;
}

const ALREADY_VERIFIED_CODES = new Set([
  "ALREADY_VERIFIED",
  "EMAIL_ALREADY_VERIFIED",
  "PHONE_ALREADY_VERIFIED",
  "CONTACT_ALREADY_VERIFIED",
]);

export type RegisteredContactTarget = {
  email: string;
  phoneNumber: string;
};

export type RegisteredContactOtpRequest =
  | { channel: "email"; email: string }
  | { channel: "phone"; phoneNumber: string; resend?: boolean };

export type RegisteredContactOtpConfirm =
  | { channel: "email"; email: string; code: string }
  | { channel: "phone"; phoneNumber: string; phoneOtp: string };

export function isContactAlreadyVerifiedError(error: unknown): boolean {
  const code = readAlreadyVerifiedCode(error)?.toUpperCase().replace(/[\s-]+/g, "_");
  if (code && ALREADY_VERIFIED_CODES.has(code)) {
    return true;
  }

  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : "";

  return /already\s+verified/i.test(message);
}

export function registeredContactChannel(body: {
  channel: ContactVerificationChannel;
}): ContactVerificationChannel {
  return body.channel;
}

/**
 * Email requests carry only the account email.
 * Phone requests carry only the account phone.
 */
export function buildRegisteredContactOtpRequest(
  channel: ContactVerificationChannel,
  contact: RegisteredContactTarget,
  options?: { resend?: boolean },
): RegisteredContactOtpRequest {
  if (channel === "email") {
    return { channel: "email", email: contact.email.trim() };
  }

  return {
    channel: "phone",
    phoneNumber: contact.phoneNumber.trim(),
    resend: options?.resend === true,
  };
}

/** Confirm body for the same channel that requested the OTP. */
export function buildRegisteredContactOtpConfirm(
  channel: ContactVerificationChannel,
  contact: RegisteredContactTarget,
  code: string,
): RegisteredContactOtpConfirm {
  if (channel === "email") {
    return {
      channel: "email",
      email: contact.email.trim(),
      code,
    };
  }

  return {
    channel: "phone",
    phoneNumber: contact.phoneNumber.trim(),
    phoneOtp: code,
  };
}
