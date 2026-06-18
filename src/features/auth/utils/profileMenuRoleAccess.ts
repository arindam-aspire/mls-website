import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { hasPermission } from "@/src/lib/auth/hasPermission";
import { UserRole } from "@/src/lib/auth/roles";

/** Roles that see My Recently Viewed in public/landing profile and mobile menus. */
const RECENTLY_VIEWED_MENU_ROLE_NAMES = new Set<string>([
  UserRole.USER,
  UserRole.OWNER,
]);

/** API may return `agency` while permissions use `admin` for agency users. */
const MANAGE_LISTINGS_LEGACY_AGENCY_ROLE = "agency";

function hasRecentlyViewedRole(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return RECENTLY_VIEWED_MENU_ROLE_NAMES.has(roleName);
}

export function isAgentUser(user: LoggedInUser | null | undefined): boolean {
  return user?.roles?.some((role) => role.name === UserRole.AGENT) ?? false;
}

function isAgencyRoleName(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  const role = roleName.toLowerCase();
  return role === UserRole.AGENCY || role === MANAGE_LISTINGS_LEGACY_AGENCY_ROLE;
}

/** Agency portal users (`admin` / legacy `agency`). */
export function isAgencyUser(user: LoggedInUser | null | undefined): boolean {
  return isAgencyRoleName(user?.roles?.[0]?.name);
}

export function isOwnerUser(user: LoggedInUser | null | undefined): boolean {
  return user?.roles?.some((role) => role.name === UserRole.OWNER) ?? false;
}

export function shouldShowDraftListingsInSidebar(
  user: LoggedInUser | null | undefined,
): boolean {
  return isAgentUser(user);
}

/** Protected layout profile popover — owners only. */
export function shouldShowDraftListingsInProtectedPopover(
  user: LoggedInUser | null | undefined,
): boolean {
  return shouldShowMyListingsMenuItem(user);
}

/** Public/landing profile popover and mobile drawers — owners and agents. */
export function shouldShowDraftListingsInPublicMenu(
  user: LoggedInUser | null | undefined,
): boolean {
  return isOwnerUser(user) || isAgentUser(user);
}

export type ProfileMenuAccessContext = "publicMenu" | "protectedPopover" | "protectedDrawer";

function shouldShowDraftListingsMenuItem(
  user: LoggedInUser | null | undefined,
  context: ProfileMenuAccessContext,
): boolean {
  switch (context) {
    case "protectedPopover":
      return shouldShowDraftListingsInProtectedPopover(user);
    case "protectedDrawer":
    case "publicMenu":
      return shouldShowDraftListingsInPublicMenu(user);
    default:
      return shouldShowDraftListingsInPublicMenu(user);
  }
}

export function shouldShowRecentlyViewedMenuItem(
  user: LoggedInUser | null | undefined,
): boolean {
  return hasRecentlyViewedRole(user?.roles?.[0]?.name);
}

export function shouldShowMyListingsMenuItem(
  user: LoggedInUser | null | undefined,
): boolean {
  return hasPermission(user, "MY_LISTINGS");
}

export function shouldShowManageListingsMenuItem(
  user: LoggedInUser | null | undefined,
): boolean {
  if (hasPermission(user, "MANAGE_LISTINGS")) {
    return true;
  }

  return (
    user?.roles?.some(
      (role) => role.name === MANAGE_LISTINGS_LEGACY_AGENCY_ROLE,
    ) ?? false
  );
}

export function resolveListingsMenuPath(
  user: LoggedInUser | null | undefined,
): "/my-listings" | "/manage-listings" | null {
  if (shouldShowManageListingsMenuItem(user)) {
    return "/manage-listings";
  }

  if (shouldShowMyListingsMenuItem(user)) {
    return "/my-listings";
  }

  return null;
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
>(
  items: readonly T[],
  user: LoggedInUser,
  context: ProfileMenuAccessContext = "publicMenu",
): T[] {
  return items.filter((item) => {
    switch (item.labelKey) {
      case "myRecentlyViewed":
        return shouldShowRecentlyViewedMenuItem(user);
      case "myListings":
        return shouldShowMyListingsMenuItem(user);
      case "manageListings":
        return shouldShowManageListingsMenuItem(user);
      case "draftListings":
        return shouldShowDraftListingsMenuItem(user, context);
      default:
        return true;
    }
  });
}
