"use client";

import FavouritePropertyScreen from "@/src/features/property/screens/FavouritePropertyScreen";
import LoadingScreen from "@/src/features/loading/screens";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function FavouritesPage() {
  const { user, isLoadingUser } = useAuthorize("FAVOURITES");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <FavouritePropertyScreen />;
}
