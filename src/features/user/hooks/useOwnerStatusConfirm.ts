"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import { useUpdateOwnerStatus } from "../mutations/owner.mutation";

export type OwnerStatusConfirmIntent = "activate" | "deactivate";

type PendingOwnerStatus = {
  owner: OwnerListRow;
  intent: OwnerStatusConfirmIntent;
};

export function useOwnerStatusConfirm() {
  const t = useTranslations("user.owners.statusConfirm");
  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateOwnerStatus();

  const [pending, setPending] = useState<PendingOwnerStatus | null>(null);

  const openConfirm = useCallback(
    (owner: OwnerListRow, intent: OwnerStatusConfirmIntent) => {
      setPending({ owner, intent });
    },
    [],
  );

  const closeConfirm = useCallback(() => {
    if (isUpdating) {
      return;
    }

    setPending(null);
  }, [isUpdating]);

  const confirmStatusChange = useCallback(async () => {
    if (!pending) {
      return;
    }

    try {
      await updateStatus({
        ownerId: pending.owner.id,
        body: {
          status: pending.intent === "activate" ? "ACTIVE" : "SUSPENDED",
        },
      });
      setPending(null);
    } catch {
      // Error toast handled in mutation.
    }
  }, [pending, updateStatus]);

  const confirmModal = useMemo(() => {
    if (!pending) {
      return null;
    }

    const { owner, intent } = pending;
    const ownerLabel = owner.name || owner.email || owner.id;

    return {
      open: true,
      title: intent === "activate" ? t("activateTitle") : t("deactivateTitle"),
      description:
        intent === "activate"
          ? t("activateDescription", { name: ownerLabel })
          : t("deactivateDescription", { name: ownerLabel }),
      confirmLabel:
        intent === "activate" ? t("activateConfirm") : t("deactivateConfirm"),
      cancelLabel: t("cancel"),
      loadingLabel: t("updating"),
      variant: (intent === "activate" ? "primary" : "danger") as
        | "primary"
        | "danger",
      isLoading: isUpdating,
      onClose: closeConfirm,
      onConfirm: confirmStatusChange,
    };
  }, [closeConfirm, confirmStatusChange, isUpdating, pending, t]);

  return {
    openConfirm,
    confirmModal,
  };
}

export type UseOwnerStatusConfirmReturn = ReturnType<typeof useOwnerStatusConfirm>;
