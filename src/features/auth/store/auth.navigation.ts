import { AUTH_VIEW, type AuthView } from "../authViews";

export const CHOOSE_ACCOUNT_SCREEN = AUTH_VIEW.chooseAccount;

export type NavType = "root" | "sibling" | "child";

/**
 * root    → resets the entire stack (fresh start)
 * sibling → replaces only the top of the stack (same level, no back entry)
 * child   → pushes onto the stack (back button unwinds it)
 */
export const SCREEN_NAV_TYPE: Record<AuthView, NavType> = {
  [AUTH_VIEW.chooseAccount]: "root",

  [AUTH_VIEW.userSocialSignIn]: "sibling",
  [AUTH_VIEW.ownerSocialSignIn]: "sibling",
  [AUTH_VIEW.userSocialSignUp]: "sibling",
  [AUTH_VIEW.ownerSocialSignUp]: "sibling",
  [AUTH_VIEW.agencySignIn]: "sibling",
  [AUTH_VIEW.agencySignUp]: "sibling",

  [AUTH_VIEW.userSignIn]: "child",
  [AUTH_VIEW.ownerSignIn]: "child",
  [AUTH_VIEW.agencyEmailSignIn]: "child",
  [AUTH_VIEW.userSignUp]: "child",
  [AUTH_VIEW.ownerSignUp]: "child",
  [AUTH_VIEW.signInOtp]: "child",
  [AUTH_VIEW.otpVerify]: "child",
  [AUTH_VIEW.forgotPassword]: "child",
  [AUTH_VIEW.resetPassword]: "child",
  [AUTH_VIEW.confirmSignUp]: "child",
};

export function resolveScreenNavType(screen: AuthView): NavType {
  return SCREEN_NAV_TYPE[screen] ?? "child";
}

export type AuthFlow =
  | "otp-signin"
  | "forgot-password"
  | "user-signup"
  | "agency-signup"
  | "none";

/**
 * Maps each screen to the flow it belongs to.
 * `none` = entry/social screens that don't own transient data.
 * When navigate() detects a flow change, it clears the abandoned flow's data.
 */
export const SCREEN_FLOW: Record<AuthView, AuthFlow> = {
  [AUTH_VIEW.chooseAccount]: "none",
  [AUTH_VIEW.userSocialSignIn]: "none",
  [AUTH_VIEW.ownerSocialSignIn]: "none",
  [AUTH_VIEW.userSocialSignUp]: "none",
  [AUTH_VIEW.ownerSocialSignUp]: "none",
  [AUTH_VIEW.agencySignIn]: "none",
  [AUTH_VIEW.userSignIn]: "none",
  [AUTH_VIEW.ownerSignIn]: "none",
  [AUTH_VIEW.agencyEmailSignIn]: "none",

  [AUTH_VIEW.signInOtp]: "otp-signin",
  [AUTH_VIEW.otpVerify]: "otp-signin",

  [AUTH_VIEW.forgotPassword]: "forgot-password",
  [AUTH_VIEW.resetPassword]: "forgot-password",

  [AUTH_VIEW.userSignUp]: "user-signup",
  [AUTH_VIEW.ownerSignUp]: "user-signup",
  [AUTH_VIEW.confirmSignUp]: "user-signup",

  [AUTH_VIEW.agencySignUp]: "agency-signup",
};

export type FlowOwnedField =
  | "otpSession"
  | "otpCode"
  | "pendingEmail"
  | "pendingPhone"
  | "pendingSignUp"
  | "pendingAgencySignUp";

/**
 * Data fields owned by each flow. Cleared when leaving that flow.
 */
export const FLOW_OWNED_DATA: Record<AuthFlow, FlowOwnedField[]> = {
  "otp-signin": ["otpSession", "otpCode", "pendingEmail", "pendingPhone"],
  "forgot-password": ["otpSession", "otpCode", "pendingEmail"],
  "user-signup": ["pendingSignUp", "pendingEmail"],
  "agency-signup": ["pendingAgencySignUp", "pendingEmail"],
  none: [],
};

/** Shared screens inherit the current flow — never trigger flow-change cleanup. */
export const FLOW_NEUTRAL_SCREENS = new Set<AuthView>([
  AUTH_VIEW.otpVerify,
  AUTH_VIEW.confirmSignUp,
]);

export function resolveScreenFlow(screen: AuthView): AuthFlow {
  return SCREEN_FLOW[screen] ?? "none";
}

/**
 * otp-verify and confirm-sign-up are shared across flows. Actual flow is
 * derived from the stack (skipping neutral screens), not the incoming screen map.
 */
