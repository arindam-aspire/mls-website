"use client";

import DashboardScreen from "@/src/features/dashboard/screens";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function DashboardPageClient() {
  const { user } = useAuthorize("DASHBOARD");

  if (!user) return null;

  return <DashboardScreen />;
}
