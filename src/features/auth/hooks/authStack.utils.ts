import { AUTH_VIEW, isAgencyAuthView, type AuthView } from "../authViews";

const AUTH_CONTEXT_SCREENS = new Set<AuthView>([
  AUTH_VIEW.userSignIn,
  AUTH_VIEW.ownerSignIn,
  AUTH_VIEW.userSocialSignIn,
  AUTH_VIEW.ownerSocialSignIn,
  AUTH_VIEW.userSignUp,
  AUTH_VIEW.ownerSignUp,
  AUTH_VIEW.userSocialSignUp,
  AUTH_VIEW.ownerSocialSignUp,
  AUTH_VIEW.agencySignIn,
  AUTH_VIEW.agencyEmailSignIn,
  AUTH_VIEW.agencySignUp,
  AUTH_VIEW.chooseAccount,
]);

export function getAuthContextFromStack(screenStack: AuthView[]): AuthView {
  for (let index = screenStack.length - 2; index >= 0; index -= 1) {
    const screen = screenStack[index];
    if (AUTH_CONTEXT_SCREENS.has(screen)) {
      return screen;
    }
  }

  const active = screenStack[screenStack.length - 1];
  if (active != null && AUTH_CONTEXT_SCREENS.has(active)) {
    return active;
  }

  return AUTH_VIEW.userSignIn;
}

export function isAgencyContextFromStack(
  screenStack: AuthView[],
  agentPortal: boolean,
): boolean {
  if (agentPortal) {
    return true;
  }

  const context = getAuthContextFromStack(screenStack);
  return isAgencyAuthView(context);
}
