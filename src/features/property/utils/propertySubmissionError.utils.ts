import { isApiError } from "@/src/apis/core/error.normalizer";

export type PropertySubmissionUiError = {
  message: string;
  fieldErrors: Record<string, string>;
  stepErrors: Record<string, string>;
  ownerDuplicateError: string | null;
};

type ValidationErrorItem = {
  loc?: unknown;
  field?: unknown;
  path?: unknown;
  msg?: unknown;
  message?: unknown;
  type?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeFieldPath(path: string): string {
  return path
    .replace(/^body\./, "")
    .replace(/^payload\./, "")
    .replace(/^data\./, "");
}

function locToPath(loc: unknown): string | null {
  if (typeof loc === "string") {
    return normalizeFieldPath(loc.replace(/\//g, "."));
  }

  if (!Array.isArray(loc)) {
    return null;
  }

  const parts = loc
    .filter((part) => part !== "body" && part !== "payload" && part !== "data")
    .map((part) => String(part));

  if (parts.length === 0) {
    return null;
  }

  return normalizeFieldPath(parts.join("."));
}

function collectErrorItems(source: unknown): ValidationErrorItem[] {
  const record = asRecord(source);
  const items: ValidationErrorItem[] = [];

  const candidates = [
    record?.errors,
    record?.details,
    record?.detail,
    asRecord(record?.error)?.errors,
    asRecord(record?.error)?.details,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        if (item && typeof item === "object") {
          items.push(item as ValidationErrorItem);
        } else if (typeof item === "string" && item.trim()) {
          items.push({ message: item });
        }
      }
    }
  }

  return items;
}

function extractMessage(source: unknown, fallback: string): string {
  const record = asRecord(source);

  return (
    toTrimmedString(record?.message) ??
    toTrimmedString(record?.detail) ??
    toTrimmedString(asRecord(record?.detail)?.message) ??
    toTrimmedString(asRecord(record?.error)?.message) ??
    fallback
  );
}

function isOwnerDuplicateMessage(message: string, path: string | null): boolean {
  const haystack = `${path ?? ""} ${message}`.toLowerCase();
  return (
    haystack.includes("owner") &&
    (haystack.includes("duplicate") || haystack.includes("already exists"))
  );
}

export function parsePropertySubmissionError(
  error: unknown,
  fallbackMessage: string,
): PropertySubmissionUiError {
  const apiError = isApiError(error) ? error : null;
  const source = apiError?.details ?? error;
  const message = apiError?.message?.trim()
    ? apiError.message
    : extractMessage(source, fallbackMessage);
  const fieldErrors: Record<string, string> = {};
  const stepErrors: Record<string, string> = {};
  let ownerDuplicateError: string | null = null;

  const record = asRecord(source);
  const nestedError = asRecord(record?.error);
  const explicitField =
    toTrimmedString(record?.field) ??
    toTrimmedString(nestedError?.field) ??
    toTrimmedString(record?.path) ??
    toTrimmedString(nestedError?.path);

  if (explicitField) {
    fieldErrors[normalizeFieldPath(explicitField)] = message;
  }

  for (const item of collectErrorItems(source)) {
    const itemMessage =
      toTrimmedString(item.message) ?? toTrimmedString(item.msg) ?? message;
    const path =
      locToPath(item.loc) ??
      toTrimmedString(item.field) ??
      toTrimmedString(item.path);

    if (path) {
      const normalized = normalizeFieldPath(path);
      fieldErrors[normalized] = itemMessage;
      if (isOwnerDuplicateMessage(itemMessage, normalized)) {
        ownerDuplicateError = itemMessage;
      }
    } else if (itemMessage && itemMessage !== message) {
      stepErrors.review_submit = itemMessage;
    }
  }

  if (!ownerDuplicateError && isOwnerDuplicateMessage(message, explicitField)) {
    ownerDuplicateError = message;
  }

  return {
    message,
    fieldErrors,
    stepErrors,
    ownerDuplicateError,
  };
}
