"use client";

import LoadingScreen from "@/src/features/loading/screens";
import { OwnersScreen } from "@/src/features/user/screens/OwnersScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function OwnersPage() {
  usePageTitle("owners");
  const { user, isLoadingUser } = useAuthorize("OWNERS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <OwnersScreen />;
}
