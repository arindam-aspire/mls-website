"use client";

import LoadingScreen from "@/src/features/loading/screens";
import ListingPropertyScreen from "@/src/features/property/screens/ListingPropertyScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function ListingPage() {
  usePageTitle("listing");
  const { user, isLoadingUser } = useAuthorize("MY_LISTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ListingPropertyScreen />;
}
