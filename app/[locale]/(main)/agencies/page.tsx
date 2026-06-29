"use client";

import { useEffect } from "react";
import { AgenciesScreen } from "@/src/features/agencies/screens/AgenciesScreen";
import LoadingScreen from "@/src/features/loading/screens";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function AgenciesPage() {
  const { user, isLoadingUser } = useAuthorize("AGENCIES");

  useEffect(() => {
    document.title = "Agencies - MLS";
  }, []);

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <AgenciesScreen />;
}
