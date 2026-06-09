"use client";

import LoadingScreen from "@/src/features/loading/screens";
import FavouritePropertyScreen from "@/src/features/property/screens/FavouritePropertyScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function FavouritesPage() {
  usePageTitle("favourites");
  const { user, isLoadingUser } = useAuthorize("FAVOURITES");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <FavouritePropertyScreen />;
}
