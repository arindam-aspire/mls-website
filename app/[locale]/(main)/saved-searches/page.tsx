"use client";

import LoadingScreen from "@/src/features/loading/screens";
import SavedSearchScreen from "@/src/features/saved-searches/screens/SavedSearchScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function SavedSearchesPage() {
  const { user, isLoadingUser } = useAuthorize("PROFILE");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <SavedSearchScreen />;
}
