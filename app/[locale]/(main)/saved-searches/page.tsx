"use client";

import SavedSearchScreen from "@/src/features/saved-searches/screens/SavedSearchScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function SavedSearchesPage() {
  const { user, isLoadingUser } = useAuthorize("PROFILE");

  if (!isLoadingUser && !user) return null;

  return <SavedSearchScreen />;
}
