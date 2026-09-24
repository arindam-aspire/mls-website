import { getPublicAppOrigin } from "@/src/configs/environment.config";

function resolveLocale(): string {
  if (typeof window === "undefined") {
    return "en";
  }

  return window.location.pathname.match(/^\/(en|ar|es|fr)(?:\/|$)/)?.[1] ?? "en";
}

function pickInvitationCandidate(trimmed: string): string {
  const segments = trimmed.includes(",")
    ? trimmed
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean)
    : [trimmed];

  return (
    segments.find(
      (segment) =>
        segment.includes("agency-password-setup") ||
        segment.includes("token=") ||
        segment.toLowerCase().includes("invitation"),
    ) ??
    segments[segments.length - 1] ??
    trimmed
  );
}

/**
 * Rewrites API-returned invitation / password-setup URLs onto the public FE origin.
 * Backend payloads may use a host from server env; emails and copy actions must use
 * `NEXT_PUBLIC_APP_URL` (via `getPublicAppOrigin`) instead of a hardcoded localhost.
 */
export function normalizeAgencyInvitationLink(link: string): string {
  try {
    const trimmed = link.trim();
    if (!trimmed) {
      return trimmed;
    }

    const origin = getPublicAppOrigin();
    if (!origin) {
      return trimmed;
    }

    const locale = resolveLocale();
    const candidate = pickInvitationCandidate(trimmed);
    const url = new URL(candidate, origin);

    const lastSegment = url.pathname.split("/").filter(Boolean).pop() ?? "";
    const tokenFromPath =
      lastSegment &&
      lastSegment !== "agency-password-setup" &&
      lastSegment !== "agency-invitation"
        ? lastSegment
        : "";

    const token =
      url.searchParams.get("token") ??
      url.searchParams.get("invitation_token") ??
      url.searchParams.get("invitation") ??
      tokenFromPath;

    const isPasswordSetup =
      candidate.includes("agency-password-setup") ||
      candidate.includes("password-setup");

    if (!token) {
      return `${origin}${url.pathname}${url.search}${url.hash}`;
    }

    const path = isPasswordSetup ? "agency-password-setup" : "agency-invitation";

    return `${origin}/${locale}/${path}?token=${encodeURIComponent(token)}`;
  } catch {
    return link;
  }
}

export function rewriteAgencyPasswordSetupLink(
  link: string | null | undefined,
): string | null {
  const trimmed = link?.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const origin = getPublicAppOrigin();
    if (!origin) {
      return trimmed;
    }

    const url = new URL(trimmed, origin);
    const locale = resolveLocale();
    const token =
      url.searchParams.get("token") ??
      url.searchParams.get("invitation_token") ??
      "";

    if (!token) {
      return `${origin}${url.pathname}${url.search}${url.hash}`;
    }

    return `${origin}/${locale}/agency-password-setup?token=${encodeURIComponent(token)}`;
  } catch {
    return trimmed;
  }
}
