import { create } from "zustand";
import { tokenStore } from "@/src/apis/core/token.store";
import { type AuthOtpFlow, type AuthView } from "../authViews";
import type {
  AgencySignUpSubmitValues,
  LoggedInUser,
  SignUpRequest,
} from "../types/auth.types";
import {
  clearAuthModalSession,
  defaultAuthModalPersistedState,
  writeAuthModalSession,
  AUTH_MODAL_SESSION_KEY,
  type AuthModalPersistedState,
} from "./authModalStorage";
import {
  FLOW_NEUTRAL_SCREENS,
  FLOW_OWNED_DATA,
  SCREEN_FLOW,
  resolveScreenNavType,
  CHOOSE_ACCOUNT_SCREEN,
  type AuthFlow,
} from "./auth.navigation";

interface AuthStore extends AuthModalPersistedState {
  user: LoggedInUser | null;
  isLoadingUser: boolean;
  access_token: string | null;
  refresh_token: string | null;
  openAuth: (screen: AuthView) => void;
  closeAuth: () => void;
  navigate: (screen: AuthView) => void;
  pop: () => void;
  setAgentPortal: (agentPortal: boolean) => void;
  setOtpFlow: (otpFlow: AuthOtpFlow | null) => void;
  setPendingEmail: (pendingEmail: string | null) => void;
  setPendingPhone: (pendingPhone: string | null) => void;
  setPendingPhoneCountry: (pendingPhoneCountry: string | null) => void;
  setOtpSession: (otpSession: string | null) => void;
  setOtpCode: (otpCode: string | null) => void;
  setPendingSignUp: (pendingSignUp: SignUpRequest | null) => void;
  setPendingAgencySignUp: (pendingAgencySignUp: AgencySignUpSubmitValues | null) => void;
  clearPendingSignUp: () => void;
  clearPendingAgencySignUp: () => void;
  clearOtpSession: () => void;
  setAuth: (
    access_token: string,
    refresh_token: string | null,
    options: { rememberMeCookie: boolean; username: string },
  ) => void;
  setAccessToken: (access_token: string) => void;
  setRefreshToken: (refresh_token: string) => void;
  setUser: (user: LoggedInUser) => void;
  setIsLoadingUser: (loading: boolean) => void;
  clearAuth: () => void;
}

function pickModalState(state: AuthStore): AuthModalPersistedState {
  return {
    isOpen: state.isOpen,
    screenStack: state.screenStack,
    agentPortal: state.agentPortal,
    otpFlow: state.otpFlow,
    pendingEmail: state.pendingEmail,
    pendingPhone: state.pendingPhone,
    pendingPhoneCountry: state.pendingPhoneCountry,
    otpSession: state.otpSession,
    otpCode: state.otpCode,
    pendingSignUp: state.pendingSignUp,
    pendingAgencySignUp: state.pendingAgencySignUp,
  };
}

type FlowOwnedState = Pick<
  AuthModalPersistedState,
  | "otpSession"
  | "otpCode"
  | "pendingEmail"
  | "pendingPhone"
  | "pendingSignUp"
  | "pendingAgencySignUp"
>;

/**
 * Derives the active flow from screenStack by walking backwards, skipping
 * flow-neutral shared screens (otp-verify, confirm-sign-up).
 */
function deriveCurrentFlow(stack: AuthView[]): AuthFlow {
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const screen = stack[i];
    if (FLOW_NEUTRAL_SCREENS.has(screen)) {
      continue;
    }
    const flow = SCREEN_FLOW[screen];
    if (flow && flow !== "none") {
      return flow;
    }
  }
  return "none";
}

/**
 * Returns a partial state patch that nulls flow-owned fields and removes
 * them from sessionStorage.
 */
function buildCleanupPatch(flow: AuthFlow): Partial<FlowOwnedState> {
  const fields = FLOW_OWNED_DATA[flow];
  if (fields.length === 0) {
    return {};
  }

  const patch: Partial<FlowOwnedState> = {};
  for (const field of fields) {
    patch[field] = null;
  }

  if (typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(AUTH_MODAL_SESSION_KEY);
      if (raw) {
        const current = JSON.parse(raw) as Record<string, unknown>;
        for (const field of fields) {
          delete current[field];
        }
        sessionStorage.setItem(AUTH_MODAL_SESSION_KEY, JSON.stringify(current));
      }
    } catch {
      // ignore quota / private mode
    }
  }

  return patch;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoadingUser: false,
  access_token: null,
  refresh_token: null,
  ...defaultAuthModalPersistedState,

  openAuth: (screen) => {
    const fresh: AuthModalPersistedState = {
      ...defaultAuthModalPersistedState,
      isOpen: true,
      screenStack: [screen],
    };
    writeAuthModalSession(fresh);
    set(fresh);
  },

  closeAuth: () => {
    clearAuthModalSession();
    set({ ...defaultAuthModalPersistedState });
  },

  navigate: (screen) => {
    const type = resolveScreenNavType(screen);

    set((state) => {
      const currentFlow = deriveCurrentFlow(state.screenStack);
      const incomingFlow = SCREEN_FLOW[screen] ?? "none";

      const isFlowChange =
        currentFlow !== "none" &&
        !FLOW_NEUTRAL_SCREENS.has(screen) &&
        incomingFlow !== currentFlow;

      const cleanupPatch = isFlowChange ? buildCleanupPatch(currentFlow) : {};

      let screenStack: AuthView[];

      switch (type) {
        case "root":
          screenStack = [screen];
          break;

        case "sibling": {
          const top = state.screenStack[state.screenStack.length - 1];
          if (top === CHOOSE_ACCOUNT_SCREEN) {
            screenStack = [...state.screenStack, screen];
          } else {
            screenStack =
              state.screenStack.length > 0
                ? [...state.screenStack.slice(0, -1), screen]
                : [screen];
          }
          break;
        }

        case "child": {
          const existingIndex = state.screenStack.indexOf(screen);
          if (existingIndex !== -1) {
            screenStack = state.screenStack.slice(0, existingIndex + 1);
          } else {
            screenStack = [...state.screenStack, screen];
          }
          break;
        }
      }

      const next: AuthModalPersistedState = {
        ...pickModalState(state),
        ...cleanupPatch,
        screenStack,
      };
      writeAuthModalSession(next);

      return {
        screenStack,
        ...cleanupPatch,
      };
    });
  },

  pop: () => {
    set((state) => {
      if (state.screenStack.length <= 1) {
        return state;
      }
      const next: AuthModalPersistedState = {
        ...pickModalState(state),
        screenStack: state.screenStack.slice(0, -1),
      };
      writeAuthModalSession(next);
      return { screenStack: next.screenStack };
    });
  },

  setAgentPortal: (agentPortal) => {
    set((state) => {
      const next = { ...pickModalState(state), agentPortal };
      writeAuthModalSession(next);
      return { agentPortal };
    });
  },

  setOtpFlow: (otpFlow) => {
    set((state) => {
      const next = { ...pickModalState(state), otpFlow };
      writeAuthModalSession(next);
      return { otpFlow };
    });
  },

  setPendingEmail: (pendingEmail) => {
    set((state) => {
      const next = { ...pickModalState(state), pendingEmail };
      writeAuthModalSession(next);
      return { pendingEmail };
    });
  },

  setPendingPhone: (pendingPhone) => {
    set((state) => {
      const next = { ...pickModalState(state), pendingPhone };
      writeAuthModalSession(next);
      return { pendingPhone };
    });
  },

  setPendingPhoneCountry: (pendingPhoneCountry) => {
    set((state) => {
      const next = { ...pickModalState(state), pendingPhoneCountry };
      writeAuthModalSession(next);
      return { pendingPhoneCountry };
    });
  },

  setOtpSession: (otpSession) => {
    set((state) => {
      const next = { ...pickModalState(state), otpSession };
      writeAuthModalSession(next);
      return { otpSession };
    });
  },

  setOtpCode: (otpCode) => {
    set((state) => {
      const next = { ...pickModalState(state), otpCode };
      writeAuthModalSession(next);
      return { otpCode };
    });
  },

  setPendingSignUp: (pendingSignUp) => {
    set((state) => {
      const next = { ...pickModalState(state), pendingSignUp };
      writeAuthModalSession(next);
      return { pendingSignUp };
    });
  },

  setPendingAgencySignUp: (pendingAgencySignUp) => {
    set((state) => {
      const next = { ...pickModalState(state), pendingAgencySignUp };
      writeAuthModalSession(next);
      return { pendingAgencySignUp };
    });
  },

  clearPendingSignUp: () => {
    set((state) => {
      const next = { ...pickModalState(state), pendingSignUp: null };
      writeAuthModalSession(next);
      return { pendingSignUp: null };
    });
  },

  clearPendingAgencySignUp: () => {
    set((state) => {
      const next = { ...pickModalState(state), pendingAgencySignUp: null };
      writeAuthModalSession(next);
      return { pendingAgencySignUp: null };
    });
  },

  clearOtpSession: () => {
    set((state) => {
      const next = { ...pickModalState(state), otpSession: null, otpCode: null };
      writeAuthModalSession(next);
      return { otpSession: null, otpCode: null };
    });
  },

  setAuth: (access_token, refresh_token, options) => {
    tokenStore.setSessionTokens({
      accessToken: access_token,
      refreshToken: refresh_token,
      rememberMeCookie: options.rememberMeCookie,
      username: options.username,
    });
    set({ access_token, refresh_token });
  },

  setAccessToken: (access_token) => {
    tokenStore.setAccessToken(access_token);
    set({ access_token });
  },

  setRefreshToken: (refresh_token) => {
    const rememberMeCookie = tokenStore.getRememberMe();
    tokenStore.setRefreshToken(refresh_token, rememberMeCookie);
    set({ refresh_token });
  },

  setUser: (user) => {
    set({ user, isLoadingUser: false });
  },

  setIsLoadingUser: (loading) => {
    set({ isLoadingUser: loading });
  },

  clearAuth: () => {
    tokenStore.clearTokens();
    set({ user: null, isLoadingUser: false, access_token: null, refresh_token: null });
  },
}));
