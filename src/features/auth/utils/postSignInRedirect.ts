import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import type { SignInRole } from "@/src/features/auth/types/signIn.types";
import type { AppLocale } from "@/src/i18n/routing";

/** API role names that should land on the dashboard after sign-in. */
const DASHBOARD_ROLE_NAMES = new Set(["admin", "agency"]);

function shouldRedirectToDashboardForRoleName(roleName: string | null | undefined): boolean {
  if (!roleName) return false;
  return DASHBOARD_ROLE_NAMES.has(roleName.toLowerCase());
}

/** Read `role.role_name` from the access JWT (available immediately after login). */
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
