import type { AuthOtpFlow } from "../authViews";
import type { AuthView } from "../authViews";
import type { AgencySignUpSubmitValues, SignUpRequest } from "../types/auth.types";

export const AUTH_MODAL_SESSION_KEY = "auth_transient";

export type AuthModalPersistedState = {
  isOpen: boolean;
  screenStack: AuthView[];
  agentPortal: boolean;
  otpFlow: AuthOtpFlow | null;
  pendingEmail: string | null;
  pendingPhone: string | null;
  pendingPhoneCountry: string | null;
  otpSession: string | null;
  otpCode: string | null;
  pendingSignUp: SignUpRequest | null;
  pendingAgencySignUp: AgencySignUpSubmitValues | null;
};

export const defaultAuthModalPersistedState: AuthModalPersistedState = {
  isOpen: false,
  screenStack: [],
  agentPortal: false,
  otpFlow: null,
  pendingEmail: null,
  pendingPhone: null,
  pendingPhoneCountry: null,
  otpSession: null,
  otpCode: null,
  pendingSignUp: null,
  pendingAgencySignUp: null,
};

export function readAuthModalSession(): AuthModalPersistedState {
  if (typeof window === "undefined") {
    return defaultAuthModalPersistedState;
  }

  try {
    const raw = sessionStorage.getItem(AUTH_MODAL_SESSION_KEY);
    if (!raw) {
      return defaultAuthModalPersistedState;
    }

    const parsed = JSON.parse(raw) as Partial<AuthModalPersistedState>;
    return {
      ...defaultAuthModalPersistedState,
      ...parsed,
      screenStack: Array.isArray(parsed.screenStack)
        ? (parsed.screenStack as AuthView[])
        : [],
    };
  } catch {
    return defaultAuthModalPersistedState;
  }
}

export function writeAuthModalSession(data: Partial<AuthModalPersistedState>) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = readAuthModalSession();
    sessionStorage.setItem(
      AUTH_MODAL_SESSION_KEY,
      JSON.stringify({ ...current, ...data }),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function clearAuthModalSession() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(AUTH_MODAL_SESSION_KEY);
  } catch {
    // ignore
  }
}
