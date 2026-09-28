/**
 * API may return comma-separated URLs. Prefer the segment that contains the
 * invite path. Backend links are already absolute (`/agent-invite?token=` or
 * `/agent-password-setup?token=`). Keep that host; do not rebuild the URL.
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

  const inviteSegment =
    segments.find(
      (segment) =>
        segment.includes("agent-invite") ||
        segment.includes("agent-password-setup") ||
        segment.includes("token="),
    ) ??
    segments[segments.length - 1] ??
    trimmed;

  try {
    const url = new URL(inviteSegment);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return inviteSegment;
    }

    const token =
      url.searchParams.get("token") ??
      url.searchParams.get("invitation_token") ??
      "";

    if (!token) {
      return url.toString();
    }

    const isPasswordSetup = url.pathname.includes("agent-password-setup");
    const path = isPasswordSetup ? "agent-password-setup" : "agent-invite";
    const locale = url.pathname.match(/^\/(en|ar|es|fr)(?=\/|$)/)?.[1];
    const prefix = locale ? `/${locale}` : "";

    return `${url.origin}${prefix}/${path}?token=${encodeURIComponent(token)}`;
  } catch {
    return inviteSegment;
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
