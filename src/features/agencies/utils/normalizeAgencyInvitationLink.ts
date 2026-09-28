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
        segment.includes("agency-invitation") ||
        segment.includes("token="),
    ) ??
    segments[segments.length - 1] ??
    trimmed
  );
}

function readToken(url: URL): string {
  return (
    url.searchParams.get("token") ??
    url.searchParams.get("invitation_token") ??
    url.searchParams.get("invitation") ??
    ""
  );
}

/**
 * Keeps the backend's absolute invitation URL. Does not replace the host
 * with the browser origin or any other frontend base URL.
 * Path stays `/agency-invitation` or `/agency-password-setup`, with `token`.
 */
export function normalizeAgencyInvitationLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) {
    return trimmed;
  }

  const candidate = pickInvitationCandidate(trimmed);

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return candidate;
    }

    const token = readToken(url);
    if (!token) {
      return url.toString();
    }

    const isPasswordSetup =
      url.pathname.includes("agency-password-setup") ||
      url.pathname.includes("password-setup");
    const path = isPasswordSetup ? "agency-password-setup" : "agency-invitation";
    const locale = url.pathname.match(/^\/(en|ar|es|fr)(?=\/|$)/)?.[1];
    const prefix = locale ? `/${locale}` : "";

    return `${url.origin}${prefix}/${path}?token=${encodeURIComponent(token)}`;
  } catch {
    return candidate;
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
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return trimmed;
    }

    const token = readToken(url);
    if (!token) {
      return url.toString();
    }

    const locale = url.pathname.match(/^\/(en|ar|es|fr)(?=\/|$)/)?.[1];
    const prefix = locale ? `/${locale}` : "";

    return `${url.origin}${prefix}/agency-password-setup?token=${encodeURIComponent(token)}`;
  } catch {
    return trimmed;
  }
}
