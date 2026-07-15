/**
 * Formats a backend agent status enum for display without changing its meaning.
 * Example: `PENDING_REVIEW` → `Pending Review`
 */
export function formatAgentStatusLabel(status: string | null | undefined): string {
  const trimmed = status?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  return trimmed
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
