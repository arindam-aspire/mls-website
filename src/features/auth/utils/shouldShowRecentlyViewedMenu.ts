import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { UserRole } from "@/src/lib/auth/roles";

/** Roles that see My Recently Viewed in public/landing profile and mobile menus. */
const RECENTLY_VIEWED_MENU_ROLE_NAMES = new Set<string>([
  UserRole.USER,
  UserRole.OWNER,
]);

export function shouldShowRecentlyViewedMenuItem(
  user: LoggedInUser | null | undefined,
): boolean {
  const roleName = user?.roles?.[0]?.name;
  if (!roleName) return false;
  return RECENTLY_VIEWED_MENU_ROLE_NAMES.has(roleName);
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
