"use client";

import LoadingScreen from "@/src/features/loading/screens";
import DashboardScreen from "@/src/features/dashboard/screens";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function DashboardPage() {
  usePageTitle("dashboard");
  const { user, isLoadingUser } = useAuthorize("DASHBOARD");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <DashboardScreen />;
}
