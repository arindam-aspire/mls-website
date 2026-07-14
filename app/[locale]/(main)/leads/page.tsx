"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { LeadsScreen } from "@/src/features/leads/screens/LeadsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function LeadsPage() {
  usePageTitle("leads");
  const { user, isLoadingUser } = useAuthorize("LEADS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <LeadsScreen />;
}
