import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { UserRole } from "@/src/lib/auth/roles";

/** Roles that see My Recently Viewed in public/landing profile and mobile menus. */
const RECENTLY_VIEWED_MENU_ROLE_NAMES = new Set<string>([
  UserRole.USER,
  UserRole.OWNER,
]);

function hasRecentlyViewedRole(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return RECENTLY_VIEWED_MENU_ROLE_NAMES.has(roleName);
}

export function shouldShowRecentlyViewedMenuItem(
  user: LoggedInUser | null | undefined,
): boolean {
  return hasRecentlyViewedRole(user?.roles?.[0]?.name);
}

/** Whether property details should record a recent view (`registered_user` / `owner`). */
export function canTrackRecentPropertyView(
  user: LoggedInUser | null | undefined,
  loggedInUserRole: string | null | undefined,
): boolean {
  return hasRecentlyViewedRole(user?.roles?.[0]?.name ?? loggedInUserRole);
}

export function filterProfileMenuItemsWithRoleAccess<
  T extends { labelKey: string },
>(items: readonly T[], user: LoggedInUser): T[] {
  return items.filter(
    (item) =>
      item.labelKey !== "myRecentlyViewed" ||
      shouldShowRecentlyViewedMenuItem(user),
  );
}
