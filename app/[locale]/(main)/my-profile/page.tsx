"use client";

import LoadingScreen from "@/src/features/loading/screens";
import ProfileScreen from "@/src/features/profile/screens/ProfileScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function MyProfilePage() {
  usePageTitle("myProfile");
  const { user, isLoadingUser } = useAuthorize("PROFILE");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ProfileScreen />;
}
