import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { AppLocale } from "@/src/i18n/routing";
import { navigateTo } from "@/src/utils/navigation.utils";
import {
  getPostSignInRedirectPath,
  resolveImmediateDashboardPath,
} from "./postSignInRedirect";

/** Closes the auth modal and continues the redirect already chosen for this sign-in. */
export function finishAuthenticatedSession(locale: AppLocale) {
  const state = useAuthStore.getState();
  const dashboardPath = state.access_token
    ? resolveImmediateDashboardPath(state.access_token, locale)
    : null;
  const path =
    dashboardPath ??
    (state.user ? getPostSignInRedirectPath(state.user, locale) : null);

  state.setSignupPhoneVerificationPending(false);
  state.setPendingPhone(null);
  state.closeAuth();

  if (path) {
    navigateTo(path);
  }
}
