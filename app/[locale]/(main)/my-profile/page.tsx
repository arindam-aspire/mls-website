"use client";

import ProfileScreen from "@/src/features/profile/screens/ProfileScreen";
import { useAuthorize } from "@/src/lib/auth/authorize";
import LoadingScreen from "@/src/features/loading/screens";

export default function MyProfilePage() {
  const { user, isLoadingUser } = useAuthorize("PROFILE");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ProfileScreen />;
}
