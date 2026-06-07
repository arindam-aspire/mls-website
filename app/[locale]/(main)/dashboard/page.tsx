"use client";

import DashboardScreen from "@/src/features/dashboard/screens";
import LoadingScreen from "@/src/features/loading/screens";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function DashboardPage() {
  const { user, isLoadingUser } = useAuthorize("DASHBOARD");


  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <DashboardScreen />;
}
