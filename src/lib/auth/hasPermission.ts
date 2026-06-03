import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { PERMISSIONS, type PermissionKey } from "./permissions";

export function hasPermission(
  user: LoggedInUser | null | undefined,
  permission: PermissionKey,
): boolean {
  if (!user?.roles?.length) {
    return false;
  }

  const allowedRoles = new Set<string>(PERMISSIONS[permission]);
  return user.roles.some((role) => allowedRoles.has(role.name));
}
