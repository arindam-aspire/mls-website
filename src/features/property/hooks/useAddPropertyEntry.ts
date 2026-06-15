"use client";

import { isOwnerUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useRouter } from "@/src/i18n/navigation";
import { useCallback, useState } from "react";

type UseAddPropertyEntryOptions = {
  /** When true, `has_agency` is checked only for owner role; other roles go straight to create. */
  restrictForOwnerOnly?: boolean;
};

export function useAddPropertyEntry(options: UseAddPropertyEntryOptions = {}) {
  const { restrictForOwnerOnly = false } = options;
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isSelectAgencyOpen, setIsSelectAgencyOpen] = useState(false);

  const onAddProperty = useCallback(() => {
    const shouldCheckHasAgency = restrictForOwnerOnly ? isOwnerUser(user) : true;

    if (!shouldCheckHasAgency || user?.has_agency === true) {
      router.push("/property-create");
      return;
    }

    setIsSelectAgencyOpen(true);
  }, [restrictForOwnerOnly, router, user]);

  const closeSelectAgency = useCallback(() => {
    setIsSelectAgencyOpen(false);
  }, []);

  return {
    onAddProperty,
    isSelectAgencyOpen,
    setIsSelectAgencyOpen,
    closeSelectAgency,
  };
}

export type { UseAddPropertyEntryOptions };
