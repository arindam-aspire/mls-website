"use client";

import { useCallback } from "react";
import type { PropertyOwnerSearchResult } from "@abdoun/abdoun-library";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isSuperAdminUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { mapOwnerListItemToSearchResult } from "@/src/features/property/mappers/propertyOwnerSearch.mapper";
import {
  getOwnerList,
  getPlatformOwnerList,
} from "@/src/features/user/services/owner.service";

export function usePropertyOwnerSearch() {
  const user = useAuthStore((state) => state.user);
  const agencyId = user?.agency?.agency_id?.trim() ?? "";
  const isSuperAdmin = isSuperAdminUser(user);

  const onSearchOwners = useCallback(
    async (query: string): Promise<PropertyOwnerSearchResult[]> => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        return [];
      }

      const params = { page: 1, pageSize: 10, search: trimmed };
      const response = isSuperAdmin
        ? await getPlatformOwnerList(params)
        : agencyId
          ? await getOwnerList(agencyId, params)
          : await getPlatformOwnerList(params);

      return response.owners.map(mapOwnerListItemToSearchResult);
    },
    [agencyId, isSuperAdmin],
  );

  return { onSearchOwners };
}
