/**
 * API may return comma-separated URLs; prefer the segment that contains the invite path/token.
 */
export function parseAgentInviteLink(rawLink: string): string {
  const trimmed = rawLink.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (!trimmed.includes(",")) {
    return trimmed;
  }

  const segments = trimmed
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  const inviteSegment = segments.find(
    (segment) => segment.includes("agent-invite") || segment.includes("token="),
  );

  return inviteSegment ?? segments[segments.length - 1] ?? trimmed;
}
