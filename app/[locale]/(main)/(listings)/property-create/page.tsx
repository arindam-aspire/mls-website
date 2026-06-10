"use client";

import LoadingScreen from "@/src/features/loading/screens";
import PropertyCreateScreen from "@/src/features/property/screens/PropertyCreateScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function PropertyCreatePage() {
  usePageTitle("propertyCreate");
  const { user, isLoadingUser } = useAuthorize("PROPERTY_CREATE");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <PropertyCreateScreen />;
}
