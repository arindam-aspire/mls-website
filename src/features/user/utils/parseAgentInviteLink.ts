/**
 * API may return comma-separated URLs; prefer the segment that contains the invite path/token.
 * Absolute URLs from the API may hardcode a host such as `http://localhost:3000`;
 * rewrite onto `window.location.origin` while keeping path, query, and token.
 */
export function parseAgentInviteLink(rawLink: string): string {
  const trimmed = rawLink.trim();

  if (!trimmed) {
    return trimmed;
  }

  const segments = trimmed.includes(",")
    ? trimmed
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean)
    : [trimmed];

  const inviteSegment = segments.find(
    (segment) =>
      segment.includes("agent-invite") ||
      segment.includes("agent-password-setup") ||
      segment.includes("token="),
  );

  const link = inviteSegment ?? segments[segments.length - 1] ?? trimmed;

  if (typeof window === "undefined") {
    return link;
  }

  try {
    const url = new URL(link, window.location.origin);
    const locale =
      window.location.pathname.match(/^\/(en|ar|es|fr)(?:\/|$)/)?.[1] ?? "en";

    const pathname = /^\/(en|ar|es|fr)(?:\/|$)/.test(url.pathname)
      ? url.pathname.replace(/^\/(en|ar|es|fr)(?=\/|$)/, `/${locale}`)
      : url.pathname.startsWith("/")
        ? `/${locale}${url.pathname}`
        : `/${locale}/${url.pathname}`;

    return `${window.location.origin}${pathname}${url.search}${url.hash}`;
  } catch {
    return link;
  }
}

type AgentInviteLinkSource = {
  inviteLink?: string | null;
  invitation_url?: string | null;
  invitationUrl?: string | null;
  invite_link?: string | null;
};

/**
 * Resolve the invitation URL from invite/resend API payloads.
 * Prefers `invitation_url`, then camelCase / snake_case `inviteLink` aliases.
 */
export function resolveAgentInviteLinkFromPayload(
  data: AgentInviteLinkSource | null | undefined,
): string {
  if (!data) {
    return "";
  }

  const raw =
    data.invitation_url ??
    data.invitationUrl ??
    data.inviteLink ??
    data.invite_link ??
    "";

  if (!raw.trim()) {
    return "";
  }

  return parseAgentInviteLink(raw);
}
