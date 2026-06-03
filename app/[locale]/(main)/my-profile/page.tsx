"use client";

import ProfileScreen from "@/src/features/profile/screens";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function MyProfilePage() {
  const { user } = useAuthorize("PROFILE");

  if (!user) return null;

  return <ProfileScreen />;
}
