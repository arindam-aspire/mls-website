"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import {
  getOwnerLinkedLeads,
  getOwnerLinkedProperties,
} from "../services/owner.service";

export type OwnerLinkedResourceKind = "properties" | "leads";

const LINKED_PAGE_SIZE = 10;

export type OwnerLinkedResourceRow = {
  id: string;
  [key: string]: string;
};

export function useOwnerLinkedResourcesModal() {
  const tProperties = useTranslations("user.owners.linkedPropertiesModal");
  const tLeads = useTranslations("user.owners.linkedLeadsModal");

  const [owner, setOwner] = useState<OwnerListRow | null>(null);
  const [kind, setKind] = useState<OwnerLinkedResourceKind | null>(null);
  const [page, setPage] = useState(1);

  const openProperties = useCallback((nextOwner: OwnerListRow) => {
    setOwner(nextOwner);
    setKind("properties");
    setPage(1);
  }, []);

  const openLeads = useCallback((nextOwner: OwnerListRow) => {
    setOwner(nextOwner);
    setKind("leads");
    setPage(1);
  }, []);

  const closeModal = useCallback(() => {
    setOwner(null);
    setKind(null);
    setPage(1);
  }, []);

  const isProperties = kind === "properties";
  const t = isProperties ? tProperties : tLeads;

  const propertiesQuery = useQuery({
    queryKey: ["owners", "linked", "properties", owner?.id, page],
    queryFn: () =>
      getOwnerLinkedProperties(owner!.id, {
        page,
        pageSize: LINKED_PAGE_SIZE,
      }),
    enabled: Boolean(owner?.id && kind === "properties"),
    retry: false,
  });

  const leadsQuery = useQuery({
    queryKey: ["owners", "linked", "leads", owner?.id, page],
    queryFn: () =>
      getOwnerLinkedLeads(owner!.id, {
        page,
        pageSize: LINKED_PAGE_SIZE,
      }),
    enabled: Boolean(owner?.id && kind === "leads"),
    retry: false,
  });

  const activeQuery = isProperties ? propertiesQuery : leadsQuery;
  const apiError = activeQuery.error as unknown as ApiError | undefined;
  const emptyValue = t("emptyValue");

  const rows = useMemo((): OwnerLinkedResourceRow[] => {
    if (isProperties) {
      return (propertiesQuery.data?.items ?? []).map((item) => ({
        id: item.id,
        title: item.title?.trim() || item.reference?.trim() || item.id,
        status: item.status?.trim() || emptyValue,
        city: item.city?.trim() || emptyValue,
        listingType: item.listing_type?.trim() || emptyValue,
      }));
    }

    return (leadsQuery.data?.items ?? []).map((item) => ({
      id: item.id,
      name: item.name?.trim() || emptyValue,
      email: item.email?.trim() || emptyValue,
      phone: item.phone?.trim() || emptyValue,
      status: item.status?.trim() || emptyValue,
    }));
  }, [emptyValue, isProperties, leadsQuery.data?.items, propertiesQuery.data?.items]);

  const columns = useMemo(() => {
    if (isProperties) {
      return [
        { key: "title", label: tProperties("columns.title") },
        { key: "status", label: tProperties("columns.status") },
        { key: "city", label: tProperties("columns.city") },
        { key: "listingType", label: tProperties("columns.listingType") },
      ];
    }

    return [
      { key: "name", label: tLeads("columns.name") },
      { key: "email", label: tLeads("columns.email") },
      { key: "phone", label: tLeads("columns.phone") },
      { key: "status", label: tLeads("columns.status") },
    ];
  }, [isProperties, tLeads, tProperties]);

  const pagination = activeQuery.data?.pagination;

  return {
    open: Boolean(owner && kind),
    title: owner
      ? t("title", { name: owner.name || owner.email || owner.id })
      : "",
    description: t("description"),
    closeLabel: t("close"),
    loadingLabel: t("loading"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    errorTitle: t("errorTitle"),
    errorDescription: apiError?.message || t("errorDescription"),
    previousLabel: t("previous"),
    nextLabel: t("next"),
    pageLabel:
      pagination != null
        ? t("pageLabel", {
            page: pagination.page,
            totalPages: Math.max(pagination.totalPages, 1),
          })
        : "",
    isLoading: activeQuery.isPending || activeQuery.isFetching,
    isError: activeQuery.isError,
    isEmpty:
      !activeQuery.isPending &&
      !activeQuery.isFetching &&
      !activeQuery.isError &&
      rows.length === 0,
    columns,
    rows,
    hasPrevious: Boolean(pagination?.hasPrevious),
    hasNext: Boolean(pagination?.hasNext),
    onPrevious: () => setPage((current) => Math.max(1, current - 1)),
    onNext: () => setPage((current) => current + 1),
    openProperties,
    openLeads,
    closeModal,
  };
}

export type UseOwnerLinkedResourcesModalReturn = ReturnType<
  typeof useOwnerLinkedResourcesModal
>;
