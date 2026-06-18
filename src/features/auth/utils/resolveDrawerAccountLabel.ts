import type { LoggedInUser } from "@/src/features/auth/types/user.types";

type DrawerAccountTranslate = (
  key: "personalAndBusinessProfile" | "profile",
) => string;

function isAdminRole(roleName: string | undefined): boolean {
  if (!roleName) return false;
  const role = roleName.toLowerCase();
  return role === "admin" || role === "agency";
}

export const DRAWER_AGENCY_SETTINGS_PATH = "/agency-settings";
export const DRAWER_NOTIFICATION_SETTINGS_PATH = "/notification-settings";

export function resolveDrawerAccountLabel(
  user: LoggedInUser | null | undefined,
  t: DrawerAccountTranslate,
): string {
  if (!user) {
    return t("profile");
  }

  const roleName = user.roles?.[0]?.name;
  return isAdminRole(roleName)
    ? t("personalAndBusinessProfile")
    : t("profile");
}

export function shouldShowDrawerNotificationSettings(
  user: LoggedInUser | null | undefined,
): boolean {
  if (!user) {
    return false;
  }

  const roleName = user.roles?.[0]?.name?.toLowerCase();
  return roleName === "owner" || roleName === "registered_user";
}

export function shouldShowDrawerAgencySettings(
  user: LoggedInUser | null | undefined,
): boolean {
  if (!user) {
    return false;
  }

  return isAdminRole(user.roles?.[0]?.name);
}
