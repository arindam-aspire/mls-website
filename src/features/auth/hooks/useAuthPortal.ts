"use client";

import { useAuthStore } from "../store/auth.store";

export function useAuthPortal(): "agent" | null {
  const agentPortal = useAuthStore((state) => state.agentPortal);
  return agentPortal ? "agent" : null;
}

export function useIsAgentSignInPortal(): boolean {
  return useAuthStore((state) => state.agentPortal);
}

export function useAuthModalNavigation() {
  const screenStack = useAuthStore((state) => state.screenStack);
  const pop = useAuthStore((state) => state.pop);
  const canGoBack = screenStack.length > 1;

  return {
    canGoBack,
    onBack: canGoBack ? pop : undefined,
  };
}
