"use client";

import { useSearchParams } from "next/navigation";
import {
  AUTH_PORTAL_QUERY_KEY,
  isAgentAuthPortal,
  parseAuthPortal,
  type AuthPortalContext,
} from "../authViews";

export function useAuthPortal(): AuthPortalContext | null {
  const searchParams = useSearchParams();
  return parseAuthPortal(searchParams.get(AUTH_PORTAL_QUERY_KEY));
}

export function useIsAgentSignInPortal(): boolean {
  return isAgentAuthPortal(useAuthPortal());
}
