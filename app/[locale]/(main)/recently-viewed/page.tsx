"use client";

import LoadingScreen from "@/src/features/loading/screens";
import RecentlyViewedScreen from "@/src/features/property/screens/RecentlyViewedScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function RecentlyViewedPage() {
  const { user, isLoadingUser } = useAuthorize("RECENTLY_VIEWED");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <RecentlyViewedScreen />;
}
