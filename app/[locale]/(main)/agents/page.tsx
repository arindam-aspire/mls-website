"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { AgentsScreen } from "@/src/features/user/screens/AgentsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function AgentsPage() {
  usePageTitle("agents");
  const { user, isLoadingUser } = useAuthorize("AGENTS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <AgentsScreen />;
}
