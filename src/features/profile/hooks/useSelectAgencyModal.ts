"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { PROPERTY_CREATE_AGENCY_ID_PARAM } from "@/src/features/property/constants/propertyCreate.constants";
import { useRouter } from "@/src/i18n/navigation";
import { useToast } from "@/src/hooks/useToast";
import {
  DEFAULT_AGENCY_LIST_LIMIT,
  DEFAULT_AGENCY_LIST_SKIP,
} from "../constants/selectAgency.constants";
import { assignUserAgencyAndRefreshUser, getAgencyList } from "../services/profile.service";
import type { AgencyListItem } from "../types/profile.types";
import { filterAgenciesBySearch } from "../utils/selectAgency.utils";

type UseSelectAgencyModalParams = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function useSelectAgencyModal({ isOpen, setIsOpen }: UseSelectAgencyModalParams) {
  const router = useRouter();
  const t = useTranslations("profile.selectAgency");
  const tCommon = useTranslations("common");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: agencyList,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["agency", "list", DEFAULT_AGENCY_LIST_SKIP, DEFAULT_AGENCY_LIST_LIMIT],
    queryFn: () =>
      getAgencyList({
        skip: DEFAULT_AGENCY_LIST_SKIP,
        limit: DEFAULT_AGENCY_LIST_LIMIT,
      }),
    enabled: isOpen,
  });

  const assignAgencyMutation = useMutation({
    mutationFn: assignUserAgencyAndRefreshUser,
  });

  const agencies = agencyList?.items ?? [];

  const filteredAgencies = useMemo(
    () => filterAgenciesBySearch(agencies, searchQuery),
    [agencies, searchQuery],
  );

  const selectedAgency = useMemo(
    () => agencies.find((agency) => agency.id === selectedAgencyId) ?? null,
    [agencies, selectedAgencyId],
  );

  const closeModal = useCallback(() => {
    if (assignAgencyMutation.isPending) {
      return;
    }
    setIsOpen(false);
  }, [assignAgencyMutation.isPending, setIsOpen]);

  const onSelectAgency = useCallback(
    (agency: AgencyListItem) => {
      if (assignAgencyMutation.isPending) {
        return;
      }
      setSelectedAgencyId(agency.id);
    },
    [assignAgencyMutation.isPending],
  );

  const onSearchChange = useCallback(
    (value: string) => {
      if (assignAgencyMutation.isPending) {
        return;
      }
      setSearchQuery(value);
    },
    [assignAgencyMutation.isPending],
  );

  const onClearSearch = useCallback(() => {
    if (assignAgencyMutation.isPending) {
      return;
    }
    setSearchQuery("");
  }, [assignAgencyMutation.isPending]);

  const onContinue = useCallback(() => {
    if (assignAgencyMutation.isPending) {
      return;
    }

    if (!selectedAgencyId) {
      toast.error(t("selectAgencyRequiredTitle"), {
        description: t("selectAgencyRequiredDescription"),
      });
      return;
    }

    assignAgencyMutation.mutate(selectedAgencyId, {
      onSuccess: (user) => {
        setUser(user);
        setIsOpen(false);
        router.push(
          `/property-create?${PROPERTY_CREATE_AGENCY_ID_PARAM}=${encodeURIComponent(selectedAgencyId)}`,
        );
      },
      onError: (mutationError) => {
        const apiError = mutationError as unknown as ApiError;
        toast.error(t("assignAgencyErrorTitle"), {
          description: apiError.message,
        });
      },
    });
  }, [
    assignAgencyMutation,
    router,
    selectedAgencyId,
    setIsOpen,
    setUser,
    t,
    toast,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAgencyId(null);
      setSearchQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isError) return;
    const apiError = error as unknown as ApiError;
    toast.error(t("fetchErrorTitle"), {
      description: apiError.message,
    });
  }, [error, isError, t, toast]);

  const isLoading = isOpen && isPending;
  const isContinuePending = assignAgencyMutation.isPending;
  const isEmpty = !isLoading && !isError && agencies.length === 0;
  const isSearchEmpty =
    !isLoading && !isError && agencies.length > 0 && filteredAgencies.length === 0;

  return {
    title: t("title"),
    description: t("description"),
    agencies: filteredAgencies,
    totalAgencyCount: agencies.length,
    selectedAgencyId,
    selectedAgency,
    searchQuery,
    isLoading,
    isContinuePending,
    isEmpty,
    isSearchEmpty,
    isError,
    closeModal,
    onSelectAgency,
    onSearchChange,
    onClearSearch,
    onContinue,
    continueLabel: t("continue"),
    continueLoadingLabel: tCommon("loading"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    noSearchResultsTitle: t("noSearchResultsTitle"),
    noSearchResultsDescription: t("noSearchResultsDescription"),
    agencyListAriaLabel: t("agencyListAriaLabel"),
    searchPlaceholder: t("searchPlaceholder"),
    clearSearchLabel: tCommon("clearSearch"),
    agencyCountLabel: t("agencyCount", { count: agencies.length }),
    selectHint: t("selectHint"),
    buildAgencyAriaLabel: (agency: AgencyListItem) =>
      t("agencyOptionAriaLabel", {
        name: agency.agency_name || agency.email,
      }),
  };
}

export type { UseSelectAgencyModalParams };
