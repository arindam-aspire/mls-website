"use client";

import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isAgentUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAdminPropertySubmissionsTable } from "./useAdminPropertySubmissionsTable";
import { useAgentListingsTable } from "./useAgentListingsTable";

export function useManageListingsScreen() {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const isAgent = isAgentUser(user);
  const isReady = Boolean(user) && !isLoadingUser;

  const agentTable = useAgentListingsTable({
    listingsNamespace: "manageListings",
    enabled: isReady && isAgent,
  });

  const adminTable = useAdminPropertySubmissionsTable({
    enabled: isReady && !isAgent,
  });

  const activeTable = isAgent ? agentTable : adminTable;

  return {
    ...activeTable,
    isLoading: !isReady || activeTable.isLoading,
  };
}
