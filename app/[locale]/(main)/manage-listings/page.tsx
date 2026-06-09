"use client";

import LoadingScreen from "@/src/features/loading/screens";
import ManageListingsScreen from "@/src/features/property/screens/ManageListingsScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function ManageListingsPage() {
  const { user, isLoadingUser } = useAuthorize("MANAGE_LISTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ManageListingsScreen />;
}
