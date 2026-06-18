"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { AgencySettingsScreen } from "@/src/features/profile/screens/AgencySettingsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function AgencySettingsPage() {
  usePageTitle("agencySettings");
  const { user, isLoadingUser } = useAuthorize("AGENCY_SETTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <AgencySettingsScreen />;
}
