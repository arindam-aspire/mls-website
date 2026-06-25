"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { NotificationSettingsScreen } from "@/src/features/profile/screens/NotificationSettingsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function NotificationSettingsPage() {
  usePageTitle("notificationSettings");
  const { user, isLoadingUser } = useAuthorize("NOTIFICATION_SETTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <NotificationSettingsScreen />;
}
