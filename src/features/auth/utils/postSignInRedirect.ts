import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import type { SignInRole } from "@/src/features/auth/types/signIn.types";
import type { AppLocale } from "@/src/i18n/routing";
import { getAccessTokenRoleName } from "./getAccessTokenRoleName";

export { getAccessTokenRoleName };

/** API role names that should land on the dashboard after sign-in. */
const DASHBOARD_ROLE_NAMES = new Set(["admin", "agency", "super_admin", "agent"]);

function shouldRedirectToDashboardForRoleName(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return DASHBOARD_ROLE_NAMES.has(roleName.toLowerCase());
}

export function shouldRedirectToDashboardAfterSignIn(user: LoggedInUser): boolean {
  return shouldRedirectToDashboardForRoleName(user.roles?.[0]?.name);
}

export function getDashboardRedirectPath(
  locale: AppLocale,
  roleName: string | null | undefined,
): string | null {
  if (!shouldRedirectToDashboardForRoleName(roleName)) return null;
  return `/${locale}/dashboard`;
}

export function getPostSignInRedirectPath(
  user: LoggedInUser,
  locale: AppLocale,
): string | null {
  return getDashboardRedirectPath(locale, user.roles?.[0]?.name);
}

export function getDashboardRedirectPathFromAccessToken(
  accessToken: string,
  locale: AppLocale,
): string | null {
  return getDashboardRedirectPath(locale, getAccessTokenRoleName(accessToken));
}

/** Fallback when access JWT has no embedded role (common on OTP verify). `admin` = agency. */
export function getDashboardRedirectPathFromSignInRole(
  locale: AppLocale,
  signInRole: SignInRole | undefined,
): string | null {
  if (signInRole === "admin") {
    return `/${locale}/dashboard`;
  } else if (signInRole === "agent") {
    return `/${locale}/dashboard`;
  }
  return getDashboardRedirectPath(locale, signInRole);
}

export function resolveImmediateDashboardPath(
  accessToken: string,
  locale: AppLocale,
  signInRole?: SignInRole,
): string | null {
  return (
    getDashboardRedirectPathFromAccessToken(accessToken, locale) ??
    getDashboardRedirectPathFromSignInRole(locale, signInRole)
  );
}
