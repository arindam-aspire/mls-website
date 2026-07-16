"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import { getOwnerDetail } from "../services/owner.service";

export function useOwnerViewModal() {
  const t = useTranslations("user.owners.viewModal");
  const [owner, setOwner] = useState<OwnerListRow | null>(null);

  const openModal = useCallback((nextOwner: OwnerListRow) => {
    setOwner(nextOwner);
  }, []);

  const closeModal = useCallback(() => {
    setOwner(null);
  }, []);

  const {
    data: detail,
    isPending: isLoadingDetail,
    isError,
    error,
  } = useQuery({
    queryKey: ["owners", "detail", owner?.id],
    queryFn: () => getOwnerDetail(owner!.id),
    enabled: Boolean(owner?.id),
    retry: false,
  });

  const emptyValue = t("emptyValue");

  const fields = useMemo(() => {
    const source = detail ?? null;
    const fallback = owner;

    return [
      {
        key: "name",
        label: t("fields.name"),
        value: source?.full_name?.trim() || fallback?.name || emptyValue,
      },
      {
        key: "phone",
        label: t("fields.phone"),
        value: source?.phone?.trim() || fallback?.phone || emptyValue,
      },
      {
        key: "email",
        label: t("fields.email"),
        value: source?.email?.trim() || fallback?.email || emptyValue,
      },
      {
        key: "status",
        label: t("fields.status"),
        value:
          source?.status?.trim() ||
          fallback?.status.label ||
          emptyValue,
      },
      {
        key: "properties",
        label: t("fields.properties"),
        value: String(
          source?.property_owned ?? fallback?.propertyOwned ?? 0,
        ),
      },
      {
        key: "leads",
        label: t("fields.leads"),
        value: String(
          source?.leads_count ??
            source?.linked_leads ??
            fallback?.leadsLinked ??
            0,
        ),
      },
    ];
  }, [detail, emptyValue, owner, t]);

  const apiError = error as unknown as ApiError | undefined;

  return {
    open: Boolean(owner),
    title: t("title"),
    description: t("description"),
    closeLabel: t("close"),
    loadingLabel: t("loading"),
    errorTitle: t("errorTitle"),
    errorDescription: apiError?.message || t("errorDescription"),
    isLoading: isLoadingDetail && !detail,
    isError,
    fields,
    openModal,
    closeModal,
  };
}

export type UseOwnerViewModalReturn = ReturnType<typeof useOwnerViewModal>;
