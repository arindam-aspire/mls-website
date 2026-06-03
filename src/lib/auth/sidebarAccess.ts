import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { UserRole } from "./roles";

/** API role names that render the protected layout sidebar (agency + agent). */
const PROTECTED_SIDEBAR_ROLE_NAMES = new Set<string>([
  UserRole.AGENCY,
  UserRole.AGENT,
  "agency",
]);

export function hasProtectedSidebarAccess(
  user: LoggedInUser | null | undefined,
): boolean {
  if (!user?.roles?.length) return false;

  return user.roles.some((role) =>
    PROTECTED_SIDEBAR_ROLE_NAMES.has(role.name),
  );
}
