"use client";

import type { DraftListItemData } from "@abdoun/abdoun-library";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { formatNotificationRelativeTime } from "@/src/features/notifications/utils/formatNotificationRelativeTime";
import type { MappedDraftListItem } from "../mappers/agentPropertyDraftsList.mapper";
import { useAddPropertyEntry } from "./useAddPropertyEntry";
import { PROPERTY_CREATE_SUBMISSION_ID_PARAM } from "../constants/propertyCreate.constants";
import {
  mapAgentPropertyDraftListItems,
  type MapAgentPropertyDraftLabels,
} from "../mappers/agentPropertyDraftsList.mapper";
import { useGetAgentPropertyDrafts } from "../mutations/property.mutation";
import type {
  AgentPropertyDraftListItem,
  AgentPropertyDraftsListParams,
  PaginationMeta,
} from "../types/property.types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

export function useDraftListingsScreen() {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations("propertyList.draftListings");
  const locale = useLocale() as AppLocale;
  const {
    onAddProperty: onCreateNew,
    isSelectAgencyOpen,
    setIsSelectAgencyOpen,
  } = useAddPropertyEntry({ restrictForOwnerOnly: true });

  // 4. Local state
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [listings, setListings] = useState<AgentPropertyDraftListItem[] | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [requestParams, setRequestParams] = useState<AgentPropertyDraftsListParams>(
    () => ({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  );

  // 5. Data fetching / queries
  const { mutate: getAgentPropertyDrafts, isPending: isLoadingDraftListings } =
    useGetAgentPropertyDrafts();

  const fetchDraftListings = useCallback(
    (params: AgentPropertyDraftsListParams) => {
      setRequestParams(params);
      getAgentPropertyDrafts(params, {
        onSuccess: (response) => {
          const data = response.data;
          setListings(data?.items ?? []);
          setPaginationMeta(
            response.meta?.pagination ??
              (data
                ? {
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious,
                  }
                : undefined),
          );
        },
      });
    },
    [getAgentPropertyDrafts],
  );

  // 6. Derived / memoized values
  const draftLabels = useMemo((): MapAgentPropertyDraftLabels => {
    return {
      formatUpdatedAt: (isoDate: string) => {
        const relativeTime = formatNotificationRelativeTime(isoDate, locale);
        return relativeTime ? t("updatedAt", { time: relativeTime }) : "";
      },
    };
  }, [locale, t]);

  const draftListItems = useMemo((): MappedDraftListItem[] => {
    return mapAgentPropertyDraftListItems(listings ?? [], draftLabels);
  }, [draftLabels, listings]);

  const pagination = useMemo(
    () => ({
      total: paginationMeta?.total ?? 0,
      page,
      pageSize,
      pageOptions: [...PAGE_SIZE_OPTIONS],
      totalPages: paginationMeta?.totalPages,
      hasNext: paginationMeta?.hasNext,
      hasPrevious: paginationMeta?.hasPrevious,
      maxPageButtons: 5,
      isLoading: isLoadingDraftListings,
      onPageChange: (nextPage: number) => setPage(nextPage),
      onPageSizeChange: (nextPageSize: number) => {
        setPage(1);
        setPageSize(nextPageSize);
      },
    }),
    [
      isLoadingDraftListings,
      page,
      pageSize,
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
    ],
  );

  const resumeLabel = useMemo(() => t("resume"), [t]);
  const createLabel = useMemo(() => t("createNew"), [t]);
  const addPropertyLabel = useMemo(() => t("addProperty"), [t]);

  const emptyStateContent = useMemo(
    () => ({
      title: t("emptyTitle"),
      description: t("emptyDescription"),
    }),
    [t],
  );

  // 7. Callbacks
  const onResume = useCallback(
    (item: DraftListItemData) => {
      const submissionId = String(item.id);
      router.push(
        `/property-create?${PROPERTY_CREATE_SUBMISSION_ID_PARAM}=${encodeURIComponent(submissionId)}`,
      );
    },
    [router],
  );

  const onDelete = useCallback((_item: DraftListItemData) => {
    // Delete draft API not wired yet.
  }, []);

  // 9. Effects
  useEffect(() => {
    fetchDraftListings({ page, pageSize });
  }, [fetchDraftListings, page, pageSize]);

  // 10. Return values
  return {
    listings,
    draftListItems,
    paginationMeta,
    requestParams,
    page,
    pageSize,
    setPage,
    setPageSize,
    isLoading: listings === null || isLoadingDraftListings,
    fetchDraftListings,
    pagination,
    onCreateNew,
    onResume,
    onDelete,
    resumeLabel,
    createLabel,
    addPropertyLabel,
    emptyStateContent,
    isSelectAgencyOpen,
    setIsSelectAgencyOpen,
  };
}
