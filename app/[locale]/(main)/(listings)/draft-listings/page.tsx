"use client";

import LoadingScreen from "@/src/features/loading/screens";
import DraftListingsScreen from "@/src/features/property/screens/DraftListingsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function DraftListingsPage() {
  usePageTitle("draftListings");
  const { user, isLoadingUser } = useAuthorize("DRAFT_LISTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <DraftListingsScreen />;
}
