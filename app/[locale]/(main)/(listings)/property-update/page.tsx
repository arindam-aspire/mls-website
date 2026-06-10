"use client";

import LoadingScreen from "@/src/features/loading/screens";
import PropertyUpdateScreen from "@/src/features/property/screens/PropertyUpdateScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function PropertyUpdatePage() {
  usePageTitle("propertyUpdate");
  const { user, isLoadingUser } = useAuthorize("MY_LISTINGS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <PropertyUpdateScreen />;
}
