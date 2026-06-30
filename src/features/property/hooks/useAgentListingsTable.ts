"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import type { ListTableView, PinnedColumns, SortConfig } from "@abdoun/abdoun-library";
import { PROPERTY_CREATE_SUBMISSION_ID_PARAM } from "../constants/propertyCreate.constants";
import {
  DEFAULT_MANAGE_LISTING_COLUMN_VISIBILITY,
  isManageListingTableColumnVisible,
  MANAGE_LISTING_COLUMN_I18N_KEY,
  MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS,
  type ManageListingColumnVisibility,
  type ManageListingToggleableColumnId,
} from "../constants/manageListingTableColumns.constants";
import {
  DEFAULT_MY_LISTING_COLUMN_VISIBILITY,
  isMyListingTableColumnVisible,
  MY_LISTING_COLUMN_I18N_KEY,
  MY_LISTING_TOGGLEABLE_COLUMN_IDS,
  type MyListingColumnVisibility,
  type MyListingToggleableColumnId,
} from "../constants/myListingTableColumns.constants";
import {
  MY_LISTING_STATUS_FILTER_VALUES,
  type MyListingStatusFilterValue,
} from "../constants/myListingStatusFilters.constants";
import { mapAgentPropertyListItems } from "../mappers/agentPropertiesList.mapper";
import { buildManageListingTableColumnLabels } from "../i18n/buildManageListingTableColumnLabels";
import { buildMyListingTableColumns } from "../utils/buildMyListingTableColumns";
import {
  type PropertyListingsNamespace,
  useDeletePropertySubmission,
  useGetAgentProperties,
} from "../mutations/property.mutation";
import type {
  AgentPropertiesListParams,
  AgentPropertyListItem,
  PaginationMeta,
} from "../types/property.types";
import { useToast } from "@/src/hooks/useToast";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

function buildRequestParams(
  search: string,
  status: string,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
): AgentPropertiesListParams {
  const trimmedSearch = search.trim();

  return {
    page,
    pageSize,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(status ? { status } : {}),
  };
}

function resolveLibraryLocale(locale: AppLocale): keyof LibraryPropertyListing["title"] {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

function resolveListingTitle(
  listing: LibraryPropertyListing,
  locale: keyof LibraryPropertyListing["title"],
): string {
  return listing.title[locale] || listing.title.en;
}

function isMyListingStatusFilterValue(value: string): value is MyListingStatusFilterValue {
  return (MY_LISTING_STATUS_FILTER_VALUES as readonly string[]).includes(value);
}

type UseAgentListingsTableParams = {
  listingsNamespace: PropertyListingsNamespace;
  enabled?: boolean;
};

export function useAgentListingsTable({
  listingsNamespace,
  enabled = true,
}: UseAgentListingsTableParams) {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations(`propertyList.${listingsNamespace}`);
  const tStatus = useTranslations(`propertyList.${listingsNamespace}.statusFilter`);
  const locale = useLocale() as AppLocale;
  const toast = useToast();
  const isManageListings = listingsNamespace === "manageListings";

  // 4. Local state
  const [search, setSearch] = useState("");
  const initialStatus = isManageListings ? "" : MY_LISTING_STATUS_FILTER_VALUES[0];
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<
    MyListingColumnVisibility | ManageListingColumnVisibility
  >(() =>
    isManageListings
      ? { ...DEFAULT_MANAGE_LISTING_COLUMN_VISIBILITY }
      : { ...DEFAULT_MY_LISTING_COLUMN_VISIBILITY },
  );
  const [listings, setListings] = useState<AgentPropertyListItem[] | null>(
    enabled ? null : [],
  );
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const requestParams = useMemo(
    () => buildRequestParams(search, status, page, pageSize),
    [page, pageSize, search, status],
  );
  const [rejectedReasonListing, setRejectedReasonListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingDeleteListing, setPendingDeleteListing] =
    useState<LibraryPropertyListing | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  // 5. Data fetching / queries
  const { mutate: getAgentProperties, isPending: isLoadingAgentProperties } =
    useGetAgentProperties(listingsNamespace);
  const { mutate: deletePropertySubmission, isPending: isDeletingSubmission } =
    useDeletePropertySubmission(listingsNamespace);

  const fetchAgentProperties = useCallback(
    (params: AgentPropertiesListParams) => {
      if (!enabled) {
        return;
      }

      getAgentProperties(params, {
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
    [enabled, getAgentProperties],
  );

  // 6. Derived / memoized values
  const submissionIdByPropertyId = useMemo(() => {
    const map = new Map<string, string>();

    for (const item of listings ?? []) {
      map.set(item.property_id, item.submission_id);
    }

    return map;
  }, [listings]);

  const deletingPropertyId = useMemo(() => {
    if (!deletingSubmissionId) {
      return null;
    }

    const match = listings?.find((item) => item.submission_id === deletingSubmissionId);

    return match?.property_id ?? null;
  }, [deletingSubmissionId, listings]);

  const rejectedRowActionLabels = useMemo(
    () => ({
      edit: t("workflow.edit"),
      delete: t("workflow.delete"),
    }),
    [t],
  );

  const tableListings = useMemo(() => {
    return mapAgentPropertyListItems(listings ?? [], {
      rejectedRowActionLabels,
    }).map((row) => {
      const key = row.status.key;
      const withStatusLabel = isMyListingStatusFilterValue(key)
        ? {
            ...row,
            status: {
              ...row.status,
              label: tStatus(key),
            },
          }
        : row;

      if (deletingPropertyId && withStatusLabel.property_id === deletingPropertyId) {
        return {
          ...withStatusLabel,
          is_delete_loading: true,
        };
      }

      return withStatusLabel;
    });
  }, [deletingPropertyId, listings, rejectedRowActionLabels, tStatus]);

  const tableLocale = useMemo(() => resolveLibraryLocale(locale), [locale]);

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
      isLoading: isLoadingAgentProperties,
      onPageChange: (nextPage: number) => setPage(nextPage),
      onPageSizeChange: (nextPageSize: number) => {
        setPage(1);
        setPageSize(nextPageSize);
      },
    }),
    [
      isLoadingAgentProperties,
      page,
      pageSize,
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
    ],
  );

  const noDataFound = useMemo(
    () => ({
      title: t("noDataTitle"),
      description: t("noDataDescription"),
    }),
    [t],
  );

  const navigateToPropertyView = useCallback(
    (listing: LibraryPropertyListing) => {
      router.push(`/propert-details/${listing.id}`);
    },
    [router],
  );

  const navigateToSubmissionEdit = useCallback(
    (propertyId: string) => {
      const submissionId = submissionIdByPropertyId.get(propertyId);

      if (!submissionId) {
        return;
      }

      router.push(
        `/property-create?${PROPERTY_CREATE_SUBMISSION_ID_PARAM}=${encodeURIComponent(submissionId)}`,
      );
    },
    [router, submissionIdByPropertyId],
  );

  const workflowActions = useMemo(
    () => ({
      view: {
        label: t("workflow.view"),
        onClick: navigateToPropertyView,
      },
      continue: {
        label: t("workflow.continue"),
        onClick: (listing: LibraryPropertyListing) => {
          const submissionId = submissionIdByPropertyId.get(listing.property_id);

          if (submissionId) {
            router.push(
              `/property-create?${PROPERTY_CREATE_SUBMISSION_ID_PARAM}=${encodeURIComponent(submissionId)}`,
            );
            return;
          }

          navigateToPropertyView(listing);
        },
      },
      rejected_reason: {
        label: t("workflow.viewRejectedReason"),
        onClick: (listing: LibraryPropertyListing) => {
          setRejectedReasonListing(listing);
        },
      },
    }),
    [navigateToPropertyView, router, submissionIdByPropertyId, t],
  );

  const onClickProperty = useCallback(
    (listing: LibraryPropertyListing) => {
      navigateToPropertyView(listing);
    },
    [navigateToPropertyView],
  );

  const onRowAction = useCallback(
    (actionId: string, listing: LibraryPropertyListing) => {
      if (actionId === "edit") {
        navigateToSubmissionEdit(listing.property_id);
        return;
      }

      if (actionId === "delete") {
        setPendingDeleteListing(listing);
      }
    },
    [navigateToSubmissionEdit],
  );

  const onClickDelete = useCallback((listing: LibraryPropertyListing) => {
    setPendingDeleteListing(listing);
  }, []);

  const closeDeleteConfirm = useCallback(() => {
    if (isDeletingSubmission) {
      return;
    }

    setPendingDeleteListing(null);
  }, [isDeletingSubmission]);

  const confirmDeleteListing = useCallback(() => {
    if (!pendingDeleteListing || isDeletingSubmission) {
      return;
    }

    const submissionId = submissionIdByPropertyId.get(pendingDeleteListing.property_id);

    if (!submissionId) {
      return;
    }

    setDeletingSubmissionId(submissionId);

    deletePropertySubmission(submissionId, {
      onSuccess: (response) => {
        toast.success(t("deleteSuccessTitle"), {
          description: response.message ?? t("deleteSuccessDescription"),
        });
        setDeletingSubmissionId(null);
        setPendingDeleteListing(null);
        fetchAgentProperties(requestParams);
      },
      onError: () => {
        setDeletingSubmissionId(null);
      },
    });
  }, [
    deletePropertySubmission,
    fetchAgentProperties,
    isDeletingSubmission,
    pendingDeleteListing,
    requestParams,
    submissionIdByPropertyId,
    t,
    toast,
  ]);

  const listingRowActionOptions = useMemo(
    () => ({
      onRowAction,
      canViewDelete: true,
      onClickDelete,
    }),
    [onClickDelete, onRowAction],
  );

  const allColumns = useMemo(
    () =>
      buildMyListingTableColumns({
        labels: isManageListings
          ? buildManageListingTableColumnLabels(t)
          : {
              property: t("columns.property"),
              status: t("columns.status"),
              submission: t("columns.submission"),
              submittedByEmpty: t("columns.submittedByEmpty"),
              submittedOnEmpty: t("columns.submittedOnEmpty"),
              reviewedOn: t("columns.reviewedOn"),
              reviewedOnEmpty: t("columns.reviewedOnEmpty"),
            },
        tableLocale,
        appLocale: locale,
        onClick: onClickProperty,
        workflowActions,
        listingRowActionOptions,
      }),
    [
      isManageListings,
      locale,
      listingRowActionOptions,
      onClickProperty,
      t,
      tableLocale,
      workflowActions,
    ],
  );

  const columns = useMemo(() => {
    const isColumnVisible = isManageListings
      ? isManageListingTableColumnVisible
      : isMyListingTableColumnVisible;

    return allColumns.filter((column) =>
      isColumnVisible(
        column.id,
        columnVisibility as MyListingColumnVisibility & ManageListingColumnVisibility,
      ),
    );
  }, [allColumns, columnVisibility, isManageListings]);

  const activeSortConfig = useMemo(() => {
    const isColumnVisible = isManageListings
      ? isManageListingTableColumnVisible
      : isMyListingTableColumnVisible;

    return sortConfig.filter((rule) =>
      isColumnVisible(
        rule.id,
        columnVisibility as MyListingColumnVisibility & ManageListingColumnVisibility,
      ),
    );
  }, [columnVisibility, isManageListings, sortConfig]);

  const pinnedColumns = useMemo(
    (): PinnedColumns => ({
      left: ["title"],
      right: ["actions"],
    }),
    [],
  );

  const columnOptions = useMemo(() => {
    if (isManageListings) {
      return MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS.map((id) => ({
        id,
        label: t(`columns.${MANAGE_LISTING_COLUMN_I18N_KEY[id]}`),
        visible: (columnVisibility as ManageListingColumnVisibility)[id],
      }));
    }

    return MY_LISTING_TOGGLEABLE_COLUMN_IDS.map((id) => ({
      id,
      label: t(`columns.${MY_LISTING_COLUMN_I18N_KEY[id]}`),
      visible: (columnVisibility as MyListingColumnVisibility)[id],
    }));
  }, [columnVisibility, isManageListings, t]);

  const rejectedSubmissionReviewReason = useMemo(() => {
    if (!rejectedReasonListing) {
      return "";
    }

    const sourceItem = listings?.find(
      (item) => item.property_id === rejectedReasonListing.property_id,
    );

    return sourceItem?.submission_review_reason?.trim() ?? "";
  }, [listings, rejectedReasonListing]);

  const rejectedReasonModal = useMemo(
    () => ({
      open: rejectedReasonListing !== null,
      title: t("rejectedReasonModal.title"),
      reason: rejectedSubmissionReviewReason,
      emptyReason: t("rejectedReasonModal.empty"),
      closeLabel: t("rejectedReasonModal.close"),
      onClose: () => setRejectedReasonListing(null),
    }),
    [rejectedReasonListing, rejectedSubmissionReviewReason, t],
  );

  const deleteConfirmModal = useMemo(
    () => {
      if (!enabled || !pendingDeleteListing) {
        return null;
      }

      return {
        open: true,
        title: t("deleteConfirmTitle"),
        description: t("deleteConfirmDescription", {
          title: resolveListingTitle(pendingDeleteListing, tableLocale),
        }),
        confirmLabel: t("workflow.delete"),
        cancelLabel: t("cancelLabel"),
        deletingLabel: t("deletingLabel"),
        isLoading: isDeletingSubmission,
        onClose: closeDeleteConfirm,
        onConfirm: confirmDeleteListing,
      };
    },
    [
      closeDeleteConfirm,
      confirmDeleteListing,
      enabled,
      isDeletingSubmission,
      pendingDeleteListing,
      t,
      tableLocale,
    ],
  );

  // 7. Callbacks
  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: MyListingToggleableColumnId | ManageListingToggleableColumnId, visible: boolean) => {
      setColumnVisibility((previous) => ({ ...previous, [columnId]: visible }));

      if (!visible) {
        setSortConfig((previous) => previous.filter((rule) => rule.id !== columnId));
      }
    },
    [],
  );

  // 9. Effects
  useEffect(() => {
    if (!enabled) {
      return;
    }

    fetchAgentProperties(requestParams);
  }, [enabled, fetchAgentProperties, requestParams]);

  // 10. Return values
  return {
    listings,
    tableListings,
    paginationMeta,
    requestParams,
    filters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
      listingsNamespace,
      showSearch: true,
    },
    sortConfig: activeSortConfig,
    onSort,
    tableLocale,
    pagination,
    noDataFound,
    workflowActions,
    onClickProperty,
    onClickDelete,
    onRowAction,
    columns,
    pinnedColumns,
    listTitle: t("pageTitle"),
    isLoading: enabled && (listings === null || isLoadingAgentProperties),
    fetchAgentProperties,
    rejectedReasonModal,
    deleteConfirmModal,
    approveConfirmModal: null,
    assignAgentModal: null,
    rejectSubmissionModal: null,
    unassignConfirmModal: null,
    canViewDelete: true,
  };
}
