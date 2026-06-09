"use client";

import LoadingScreen from "@/src/features/loading/screens";
import SavedSearchScreen from "@/src/features/saved-searches/screens/SavedSearchScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function SavedSearchesPage() {
  usePageTitle("savedSearches");
  const { user, isLoadingUser } = useAuthorize("SAVED_SEARCHES");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <SavedSearchScreen />;
}
