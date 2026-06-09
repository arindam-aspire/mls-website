"use client";

import LoadingScreen from "@/src/features/loading/screens";
import ListingPropertyScreen from "@/src/features/property/screens/ListingPropertyScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function ListingPage() {
  const { user, isLoadingUser } = useAuthorize("PROFILE");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ListingPropertyScreen />;
}
