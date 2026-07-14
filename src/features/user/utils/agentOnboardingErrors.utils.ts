import type { ApiError } from "@/src/apis/core/error.normalizer";

export type AgentInviteContactMethod = "email" | "phone";

export type AgentOnboardingFieldErrors = {
  email?: string;
  phone?: string;
  fullName?: string;
  whatsappNumber?: string;
  serviceArea?: string;
  position?: string;
  identityDocument?: string;
  contact?: string;
};

type AgentApiErrorKey =
  | "duplicateEmail"
  | "duplicatePhone"
  | "invalidInvitation"
  | "expiredInvitation"
  | "validationError"
  | "generic";

function extractDetailsMessage(details: unknown): string | undefined {
  if (!details || typeof details !== "object") {
    return undefined;
  }

  const record = details as Record<string, unknown>;

  if (typeof record.message === "string") {
    return record.message;
  }

  if (typeof record.detail === "string") {
    return record.detail;
  }

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0];
    if (typeof first === "string") {
      return first;
    }
    if (first && typeof first === "object" && "message" in first) {
      const message = (first as { message?: unknown }).message;
      if (typeof message === "string") {
        return message;
      }
    }
  }

  return undefined;
}

function normalizeMessage(message: string): string {
  return message.trim().toLowerCase();
}

export function resolveAgentApiErrorKey(message: string): AgentApiErrorKey {
  const normalized = normalizeMessage(message);

  if (
    normalized.includes("duplicate") &&
    (normalized.includes("email") || normalized.includes("e-mail"))
  ) {
    return "duplicateEmail";
  }

  if (normalized.includes("duplicate") && normalized.includes("phone")) {
    return "duplicatePhone";
  }

  if (normalized.includes("expired")) {
    return "expiredInvitation";
  }

  if (
    normalized.includes("invalid") &&
    (normalized.includes("invitation") || normalized.includes("token"))
  ) {
    return "invalidInvitation";
  }

  if (normalized.includes("validation")) {
    return "validationError";
  }

  return "generic";
}

export function resolveAgentApiErrorMessage(
  error: ApiError | Error,
  labels: Record<AgentApiErrorKey, string>,
): string {
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : labels.generic;
  const detailsMessage =
    "details" in error ? extractDetailsMessage(error.details) : undefined;
  const resolvedMessage = detailsMessage ?? message;
  const key = resolveAgentApiErrorKey(resolvedMessage);

  return labels[key] ?? resolvedMessage ?? labels.generic;
}

export function mapAgentInviteMutationFieldErrors(
  error: ApiError,
  labels: {
    duplicateEmail: string;
    duplicatePhone: string;
  },
): AgentOnboardingFieldErrors {
  const message = extractDetailsMessage(error.details) ?? error.message;
  const key = resolveAgentApiErrorKey(message);

  if (key === "duplicateEmail") {
    return { email: labels.duplicateEmail };
  }

  if (key === "duplicatePhone") {
    return { phone: labels.duplicatePhone };
  }

  return {};
}

export function isAgentInvitationPendingPassword(status: string | null | undefined): boolean {
  return status?.trim().toUpperCase() === "PENDING_PASSWORD";
}

export function isAgentInvitationProfileSubmitted(
  invitation: {
    status?: string | null;
    formSubmittedAt?: string | null;
  },
): boolean {
  if (invitation.formSubmittedAt) {
    return true;
  }

  const normalizedStatus = invitation.status?.trim().toUpperCase();
  return normalizedStatus === "PENDING_PASSWORD" || normalizedStatus === "ACTIVE";
}
