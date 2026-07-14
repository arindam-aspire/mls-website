/**
 * API may return comma-separated URLs; prefer the segment that contains the invite path/token.
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
    (segment) => segment.includes("agent-invite") || segment.includes("token="),
  );

  const link = inviteSegment ?? segments[segments.length - 1] ?? trimmed;

  if (/^https?:\/\//i.test(link) || typeof window === "undefined") {
    return link;
  }

  const locale =
    window.location.pathname.match(/^\/(en|ar|es|fr)(?:\/|$)/)?.[1] ?? "en";
  const localizedPath = link.startsWith(`/${locale}/`)
    ? link
    : link.startsWith("/")
      ? `/${locale}${link}`
      : `/${locale}/${link}`;

  return `${window.location.origin}${localizedPath}`;
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
