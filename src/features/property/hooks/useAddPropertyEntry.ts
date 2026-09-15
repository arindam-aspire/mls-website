"use client";

import { useRouter } from "@/src/i18n/navigation";
import { useCallback, useState } from "react";

type UseAddPropertyEntryOptions = {
  /**
   * Kept for existing callers. Owners no longer pick an agency before create;
   * they opt in on the form with Verify through Agency.
   */
  restrictForOwnerOnly?: boolean;
};

export function useAddPropertyEntry(_options: UseAddPropertyEntryOptions = {}) {
  const router = useRouter();
  const [isSelectAgencyOpen, setIsSelectAgencyOpen] = useState(false);

  const onAddProperty = useCallback(() => {
    router.push("/property-create");
  }, [router]);

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
