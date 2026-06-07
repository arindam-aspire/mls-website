import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { UserRole } from "./roles";

/** Roles that can view Location and Documents tabs on property details. */
const PROPERTY_DETAILS_RESTRICTED_TAB_ROLE_NAMES = new Set<string>([
  UserRole.AGENCY,
  UserRole.AGENT,
  UserRole.OWNER,
  "agency",
]);

export function hasPropertyDetailsRestrictedTabsAccess(
  user: LoggedInUser | null | undefined,
): boolean {
  if (!user?.roles?.length) {
    return false;
  }

  return user.roles.some((role) =>
    PROPERTY_DETAILS_RESTRICTED_TAB_ROLE_NAMES.has(role.name),
  );
}
