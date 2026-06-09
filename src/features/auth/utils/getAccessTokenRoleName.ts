/** Read `role.role_name` from the access JWT payload (no signature verification). */
export function getAccessTokenRoleName(accessToken: string): string | null {
  try {
    const segment = accessToken.split(".")[1];
    if (!segment) return null;

    const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as {
      role?: { role_name?: string };
    };

    const roleName = payload.role?.role_name;
    return typeof roleName === "string" ? roleName : null;
  } catch {
    return null;
  }
}
