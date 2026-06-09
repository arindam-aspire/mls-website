"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { NotificationScreen } from "@/src/features/notifications/screens/NotificationScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function NotificationsPage() {
  usePageTitle("notifications");
  const { user, isLoadingUser } = useAuthorize("NOTIFICATIONS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <NotificationScreen />;
}
