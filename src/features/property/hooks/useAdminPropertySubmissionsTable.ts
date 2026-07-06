"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { useToast } from "@/src/hooks/useToast";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  isAgencyUser,
  isSuperAdminUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import type { ListTableView, PinnedColumns, SortConfig } from "@abdoun/abdoun-library";
import { PROPERTY_CREATE_SUBMISSION_ID_PARAM } from "../constants/propertyCreate.constants";
import {
  ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES,
  type AdminPropertySubmissionStatusFilterValue,
} from "../constants/adminPropertySubmissionStatusFilters.constants";
import {
  DEFAULT_MANAGE_LISTING_COLUMN_VISIBILITY,
  isManageListingTableColumnVisible,
  MANAGE_LISTING_COLUMN_I18N_KEY,
  MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS,
  type ManageListingColumnVisibility,
  type ManageListingToggleableColumnId,
} from "../constants/manageListingTableColumns.constants";
import { mapAdminPropertySubmissionListItems } from "../mappers/adminPropertySubmissions.mapper";
import { buildManageListingTableColumnLabels } from "../i18n/buildManageListingTableColumnLabels";
import { buildMyListingTableColumns } from "../utils/buildMyListingTableColumns";
import {
  useGetAdminPropertySubmissions,
  useAssignAdminPropertyAgent,
  useDeactivateAdminPropertySubmission,
  useDeletePropertySubmission,
  useReviewAdminPropertySubmission,
} from "../mutations/property.mutation";
import type {
  AdminPropertySubmissionListItem,
  AdminPropertySubmissionsListParams,
  PaginationMeta,
} from "../types/property.types";
import type { AssignAgentModalMode } from "../types/assignAgentModal.types";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;
const LISTINGS_NAMESPACE = "manageListings" as const;

function buildRequestParams(
  status: string,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
): AdminPropertySubmissionsListParams {
  return {
    page,
    pageSize,
    ...(status ? { status } : {}),
  };
}

function resolveLibraryLocale(locale: AppLocale): keyof LibraryPropertyListing["title"] {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

function isAdminSubmissionStatusFilterValue(
  value: string,
): value is AdminPropertySubmissionStatusFilterValue {
  return (ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES as readonly string[]).includes(
    value,
  );
}

function resolveListingTitle(
  listing: LibraryPropertyListing,
  locale: keyof LibraryPropertyListing["title"],
): string {
  return listing.title[locale] || listing.title.en;
}

type UseAdminPropertySubmissionsTableParams = {
  enabled?: boolean;
};

export function useAdminPropertySubmissionsTable({
  enabled = true,
}: UseAdminPropertySubmissionsTableParams = {}) {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations(`propertyList.${LISTINGS_NAMESPACE}`);
  const tStatus = useTranslations(`propertyList.${LISTINGS_NAMESPACE}.statusFilter`);
  const locale = useLocale() as AppLocale;
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<ManageListingColumnVisibility>(
    () => ({ ...DEFAULT_MANAGE_LISTING_COLUMN_VISIBILITY }),
  );
  const [listings, setListings] = useState<AdminPropertySubmissionListItem[] | null>(
    enabled ? null : [],
  );
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [rejectedReasonListing, setRejectedReasonListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingApproveListing, setPendingApproveListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingRejectListing, setPendingRejectListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingUnassignListing, setPendingUnassignListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingDeactivateListing, setPendingDeactivateListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingDeleteListing, setPendingDeleteListing] =
    useState<LibraryPropertyListing | null>(null);
  const [pendingAssignListing, setPendingAssignListing] =
    useState<LibraryPropertyListing | null>(null);
  const [assignAgentModalMode, setAssignAgentModalMode] =
    useState<AssignAgentModalMode>("assign");
  const [assigningPropertyId, setAssigningPropertyId] = useState<string | null>(null);
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  // 5. Data fetching / queries
  const toast = useToast();
  const { mutate: getAdminPropertySubmissions, isPending: isLoadingSubmissions } =
    useGetAdminPropertySubmissions();
  const { mutate: reviewAdminPropertySubmission, isPending: isReviewingSubmission } =
    useReviewAdminPropertySubmission();
  const { mutate: deactivateAdminPropertySubmission, isPending: isDeactivatingSubmission } =
    useDeactivateAdminPropertySubmission();
  const { mutate: assignAdminPropertyAgent, isPending: isAssigningAgent } =
    useAssignAdminPropertyAgent();
  const { mutate: deletePropertySubmission, isPending: isDeletingSubmission } =
    useDeletePropertySubmission(LISTINGS_NAMESPACE);

  const requestParams = useMemo(
    () => buildRequestParams(status, page, pageSize),
    [page, pageSize, status],
  );

  const fetchAdminPropertySubmissions = useCallback(
    (params: AdminPropertySubmissionsListParams) => {
      if (!enabled) {
        return;
      }

      getAdminPropertySubmissions(params, {
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
    [enabled, getAdminPropertySubmissions],
  );

  // 6. Derived / memoized values
  const adminRowActionLabels = useMemo(
    () => ({
      assignAgent: t("workflow.assignAgent"),
      approve: t("workflow.approve"),
      deactivate: t("workflow.deactivate"),
      delete: t("workflow.delete"),
      edit: t("workflow.edit"),
      reject: t("workflow.reject"),
      reassign: t("workflow.reassign"),
      unassign: t("workflow.unassign"),
    }),
    [t],
  );

  const adminRowActionOptions = useMemo(
    () => {
      const isSuperAdmin = isSuperAdminUser(user);
      const canAgencyAdminManageWorkflow = isAgencyUser(user) && !isSuperAdmin;

      return {
        canReviewSubmissions: canAgencyAdminManageWorkflow,
        canManageAgentAssignment: canAgencyAdminManageWorkflow,
        canDeactivateSubmissions: isSuperAdmin,
        canEditRejectedSubmissions: false,
      };
    },
    [user],
  );

  const submissionIdByPropertyId = useMemo(() => {
    const map = new Map<string, string>();

    for (const item of listings ?? []) {
      map.set(item.property_id, item.submission_id);
    }

    return map;
  }, [listings]);

  const tableListings = useMemo(() => {
    return mapAdminPropertySubmissionListItems(listings ?? [], {
      adminRowActionLabels,
      adminRowActionOptions,
    }).map((row) => {
      const key = row.status.key;

      if (!isAdminSubmissionStatusFilterValue(key)) {
        return row;
      }

      const withStatusLabel = {
        ...row,
        status: {
          ...row.status,
          label: tStatus(key),
        },
      };

      if (
        deletingSubmissionId &&
        submissionIdByPropertyId.get(row.property_id) === deletingSubmissionId
      ) {
        return {
          ...withStatusLabel,
          is_delete_loading: true,
        };
      }

      return withStatusLabel;
    });
  }, [
    adminRowActionLabels,
    adminRowActionOptions,
    deletingSubmissionId,
    listings,
    submissionIdByPropertyId,
    tStatus,
  ]);

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
      isLoading: isLoadingSubmissions,
      onPageChange: (nextPage: number) => setPage(nextPage),
      onPageSizeChange: (nextPageSize: number) => {
        setPage(1);
        setPageSize(nextPageSize);
      },
    }),
    [
      isLoadingSubmissions,
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

  const openAssignAgentModal = useCallback(
    (listing: LibraryPropertyListing, mode: AssignAgentModalMode) => {
      setAssignAgentModalMode(mode);
      setPendingAssignListing(listing);
    },
    [],
  );

  const openAssignModal = useCallback(
    (listing: LibraryPropertyListing) => {
      openAssignAgentModal(listing, "assign");
    },
    [openAssignAgentModal],
  );

  const openReassignModal = useCallback(
    (listing: LibraryPropertyListing) => {
      openAssignAgentModal(listing, "reassign");
    },
    [openAssignAgentModal],
  );

  const closeAssignModal = useCallback(() => {
    if (isAssigningAgent) {
      return;
    }

    setPendingAssignListing(null);
    setAssignAgentModalMode("assign");
  }, [isAssigningAgent]);

  const onAssignAgent = useCallback(
    (agentId: string) => {
      if (!pendingAssignListing || isAssigningAgent) {
        return;
      }

      const propertyId = pendingAssignListing.property_id;

      if (!propertyId) {
        return;
      }

      setAssigningPropertyId(propertyId);

      assignAdminPropertyAgent(
        {
          propertyId,
          body: { agent_id: agentId },
        },
        {
          onSuccess: (response) => {
            const isReassign = assignAgentModalMode === "reassign";

            toast.success(
              isReassign ? t("reassignAgentSuccessTitle") : t("assignAgentSuccessTitle"),
              {
                description:
                  response.message ??
                  (isReassign
                    ? t("reassignAgentSuccessDescription")
                    : t("assignAgentSuccessDescription")),
              },
            );
            setAssigningPropertyId(null);
            setPendingAssignListing(null);
            setAssignAgentModalMode("assign");
            fetchAdminPropertySubmissions(requestParams);
          },
          onError: (error) => {
            setAssigningPropertyId(null);
            const apiError = error as unknown as ApiError;
            toast.error(t("assignAgentError"), {
              description: apiError.message,
            });
          },
        },
      );
    },
    [
      assignAdminPropertyAgent,
      assignAgentModalMode,
      fetchAdminPropertySubmissions,
      isAssigningAgent,
      pendingAssignListing,
      requestParams,
      t,
      toast,
    ],
  );

  const openUnassignConfirm = useCallback((listing: LibraryPropertyListing) => {
    setPendingUnassignListing(listing);
  }, []);

  const closeUnassignConfirm = useCallback(() => {
    if (isAssigningAgent) {
      return;
    }

    setPendingUnassignListing(null);
  }, [isAssigningAgent]);

  const confirmUnassignListing = useCallback(() => {
    if (!pendingUnassignListing || isAssigningAgent) {
      return;
    }

    const propertyId = pendingUnassignListing.property_id;

    if (!propertyId) {
      return;
    }

    setAssigningPropertyId(propertyId);

    assignAdminPropertyAgent(
      {
        propertyId,
        body: { agent_id: null },
      },
      {
        onSuccess: (response) => {
          toast.success(t("unassignSuccessTitle"), {
            description: response.message ?? t("unassignSuccessDescription"),
          });
          setAssigningPropertyId(null);
          setPendingUnassignListing(null);
          fetchAdminPropertySubmissions(requestParams);
        },
        onError: (error) => {
          setAssigningPropertyId(null);
          const apiError = error as unknown as ApiError;
          toast.error(t("unassignError"), {
            description: apiError.message,
          });
        },
      },
    );
  }, [
    assignAdminPropertyAgent,
    fetchAdminPropertySubmissions,
    isAssigningAgent,
    pendingUnassignListing,
    requestParams,
    t,
    toast,
  ]);

  const openDeactivateConfirm = useCallback((listing: LibraryPropertyListing) => {
    setPendingDeactivateListing(listing);
  }, []);

  const openDeleteConfirm = useCallback((listing: LibraryPropertyListing) => {
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
        fetchAdminPropertySubmissions(requestParams);
      },
      onError: () => {
        setDeletingSubmissionId(null);
      },
    });
  }, [
    deletePropertySubmission,
    fetchAdminPropertySubmissions,
    isDeletingSubmission,
    pendingDeleteListing,
    requestParams,
    submissionIdByPropertyId,
    t,
    toast,
  ]);

  const closeDeactivateConfirm = useCallback(() => {
    if (isDeactivatingSubmission) {
      return;
    }

    setPendingDeactivateListing(null);
  }, [isDeactivatingSubmission]);

  const confirmDeactivateListing = useCallback(() => {
    if (!pendingDeactivateListing || isDeactivatingSubmission) {
      return;
    }

    const submissionId = submissionIdByPropertyId.get(pendingDeactivateListing.property_id);

    if (!submissionId) {
      return;
    }

    setReviewingSubmissionId(submissionId);

    deactivateAdminPropertySubmission(submissionId, {
      onSuccess: (response) => {
        toast.success(t("deactivateSuccessTitle"), {
          description: response.message ?? t("deactivateSuccessDescription"),
        });
        setReviewingSubmissionId(null);
        setPendingDeactivateListing(null);
        fetchAdminPropertySubmissions(requestParams);
      },
      onError: (error) => {
        setReviewingSubmissionId(null);
        const apiError = error as unknown as ApiError;
        toast.error(t("deactivateError"), {
          description: apiError.message,
        });
      },
    });
  }, [
    deactivateAdminPropertySubmission,
    fetchAdminPropertySubmissions,
    isDeactivatingSubmission,
    pendingDeactivateListing,
    requestParams,
    submissionIdByPropertyId,
    t,
    toast,
  ]);

  const openApproveConfirm = useCallback((listing: LibraryPropertyListing) => {
    setPendingApproveListing(listing);
  }, []);

  const closeApproveConfirm = useCallback(() => {
    if (isReviewingSubmission) {
      return;
    }

    setPendingApproveListing(null);
  }, [isReviewingSubmission]);

  const confirmApproveListing = useCallback(() => {
    if (!pendingApproveListing || isReviewingSubmission) {
      return;
    }

    const submissionId = submissionIdByPropertyId.get(pendingApproveListing.property_id);

    if (!submissionId) {
      return;
    }

    setReviewingSubmissionId(submissionId);

    reviewAdminPropertySubmission(
      {
        submissionId,
        body: { action: "approve" },
      },
      {
        onSuccess: (response) => {
          toast.success(t("approveSuccessTitle"), {
            description: response.message ?? t("approveSuccessDescription"),
          });
          setReviewingSubmissionId(null);
          setPendingApproveListing(null);
          fetchAdminPropertySubmissions(requestParams);
        },
        onError: (error) => {
          setReviewingSubmissionId(null);
          const apiError = error as unknown as ApiError;
          toast.error(t("approveError"), {
            description: apiError.message,
          });
        },
      },
    );
  }, [
    fetchAdminPropertySubmissions,
    isReviewingSubmission,
    pendingApproveListing,
    requestParams,
    reviewAdminPropertySubmission,
    submissionIdByPropertyId,
    t,
    toast,
  ]);

  const openRejectModal = useCallback((listing: LibraryPropertyListing) => {
    setPendingRejectListing(listing);
  }, []);

  const closeRejectModal = useCallback(() => {
    if (isReviewingSubmission) {
      return;
    }

    setPendingRejectListing(null);
  }, [isReviewingSubmission]);

  const confirmRejectListing = useCallback(
    (reason: string) => {
      if (!pendingRejectListing || isReviewingSubmission) {
        return;
      }

      const submissionId = submissionIdByPropertyId.get(pendingRejectListing.property_id);

      if (!submissionId) {
        return;
      }

      setReviewingSubmissionId(submissionId);

      reviewAdminPropertySubmission(
        {
          submissionId,
          body: { action: "reject", reason },
        },
        {
          onSuccess: (response) => {
            toast.success(t("rejectSuccessTitle"), {
              description: response.message ?? t("rejectSuccessDescription"),
            });
            setReviewingSubmissionId(null);
            setPendingRejectListing(null);
            fetchAdminPropertySubmissions(requestParams);
          },
          onError: (error) => {
            setReviewingSubmissionId(null);
            const apiError = error as unknown as ApiError;
            toast.error(t("rejectError"), {
              description: apiError.message,
            });
          },
        },
      );
    },
    [
      fetchAdminPropertySubmissions,
      isReviewingSubmission,
      pendingRejectListing,
      requestParams,
      reviewAdminPropertySubmission,
      submissionIdByPropertyId,
      t,
      toast,
    ],
  );

  const onRowAction = useCallback(
    (actionId: string, listing: LibraryPropertyListing) => {
      if (actionId === "edit") {
        navigateToSubmissionEdit(listing.property_id);
        return;
      }

      if (actionId === "deactivate") {
        openDeactivateConfirm(listing);
      }

      if (actionId === "delete") {
        openDeleteConfirm(listing);
      }
    },
    [navigateToSubmissionEdit, openDeactivateConfirm, openDeleteConfirm],
  );

  const workflowActions = useMemo(
    () => ({
      view: {
        label: t("workflow.view"),
        onClick: navigateToPropertyView,
      },
      assign: {
        label: t("workflow.assignAgent"),
        onClick: openAssignModal,
      },
      approve: {
        label: t("workflow.approve"),
        onClick: openApproveConfirm,
      },
      reject: {
        label: t("workflow.reject"),
        onClick: openRejectModal,
      },
      reassign: {
        label: t("workflow.reassign"),
        onClick: openReassignModal,
      },
      unassign: {
        label: t("workflow.unassign"),
        onClick: openUnassignConfirm,
      },
      continue: {
        label: t("workflow.continue"),
        onClick: (listing: LibraryPropertyListing) => {
          navigateToSubmissionEdit(listing.property_id);
        },
      },
      rejected_reason: {
        label: t("workflow.viewRejectedReason"),
        onClick: (listing: LibraryPropertyListing) => {
          setRejectedReasonListing(listing);
        },
      },
      delete: {
        label: t("workflow.delete"),
        onClick: openDeleteConfirm,
      },
    }),
    [
      navigateToPropertyView,
      navigateToSubmissionEdit,
      openApproveConfirm,
      openAssignModal,
      openRejectModal,
      openReassignModal,
      openUnassignConfirm,
      openDeleteConfirm,
      t,
    ],
  );

  const onClickProperty = useCallback(
    (listing: LibraryPropertyListing) => {
      navigateToPropertyView(listing);
    },
    [navigateToPropertyView],
  );

  const listingRowActionOptions = useMemo(
    () => ({
      onRowAction,
      canViewDelete: true,
      onClickDelete: openDeleteConfirm,
    }),
    [onRowAction, openDeleteConfirm],
  );

  const allColumns = useMemo(
    () =>
      buildMyListingTableColumns({
        labels: buildManageListingTableColumnLabels(t),
        tableLocale,
        appLocale: locale,
        onClick: onClickProperty,
        workflowActions,
        listingRowActionOptions,
      }),
    [listingRowActionOptions, locale, onClickProperty, t, tableLocale, workflowActions],
  );

  const columns = useMemo(
    () =>
      allColumns.filter((column) =>
        isManageListingTableColumnVisible(column.id, columnVisibility),
      ),
    [allColumns, columnVisibility],
  );

  const activeSortConfig = useMemo(
    () =>
      sortConfig.filter((rule) =>
        isManageListingTableColumnVisible(rule.id, columnVisibility),
      ),
    [columnVisibility, sortConfig],
  );

  const pinnedColumns = useMemo(
    (): PinnedColumns => ({
      left: ["title"],
      right: ["actions"],
    }),
    [],
  );

  const columnOptions = useMemo(
    () =>
      MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS.map((id) => ({
        id,
        label: t(`columns.${MANAGE_LISTING_COLUMN_I18N_KEY[id]}`),
        visible: columnVisibility[id],
      })),
    [columnVisibility, t],
  );

  const rejectedSubmissionReviewReason = useMemo(() => {
    if (!rejectedReasonListing) {
      return "";
    }

    const sourceItem = listings?.find(
      (item) => item.property_id === rejectedReasonListing.property_id,
    );

    return sourceItem?.review_reason?.trim() ?? "";
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

  const isApprovingPendingListing = useMemo(() => {
    if (!pendingApproveListing) {
      return false;
    }

    const submissionId = submissionIdByPropertyId.get(pendingApproveListing.property_id);

    return Boolean(submissionId && reviewingSubmissionId === submissionId && isReviewingSubmission);
  }, [
    isReviewingSubmission,
    pendingApproveListing,
    reviewingSubmissionId,
    submissionIdByPropertyId,
  ]);

  const approveConfirmModal = useMemo(
    () => {
      if (!enabled || !pendingApproveListing) {
        return null;
      }

      return {
        open: true,
        title: t("approveConfirmTitle"),
        description: t("approveConfirmDescription", {
          title: resolveListingTitle(pendingApproveListing, tableLocale),
        }),
        confirmLabel: t("workflow.approve"),
        cancelLabel: t("cancelLabel"),
        approvingLabel: t("approvingLabel"),
        isLoading: isApprovingPendingListing,
        onClose: closeApproveConfirm,
        onConfirm: confirmApproveListing,
      };
    },
    [
      closeApproveConfirm,
      confirmApproveListing,
      enabled,
      isApprovingPendingListing,
      pendingApproveListing,
      t,
      tableLocale,
    ],
  );

  const isRejectingPendingListing = useMemo(() => {
    if (!pendingRejectListing) {
      return false;
    }

    const submissionId = submissionIdByPropertyId.get(pendingRejectListing.property_id);

    return Boolean(submissionId && reviewingSubmissionId === submissionId && isReviewingSubmission);
  }, [
    isReviewingSubmission,
    pendingRejectListing,
    reviewingSubmissionId,
    submissionIdByPropertyId,
  ]);

  const rejectSubmissionModal = useMemo(
    () => {
      if (!enabled || !pendingRejectListing) {
        return null;
      }

      return {
        open: true,
        listingTitle: resolveListingTitle(pendingRejectListing, tableLocale),
        isSubmitting: isRejectingPendingListing,
        onClose: closeRejectModal,
        onSubmit: confirmRejectListing,
      };
    },
    [
      closeRejectModal,
      confirmRejectListing,
      enabled,
      isRejectingPendingListing,
      pendingRejectListing,
      tableLocale,
    ],
  );

  const isUnassigningPendingListing = useMemo(() => {
    if (!pendingUnassignListing) {
      return false;
    }

    return (
      Boolean(assigningPropertyId === pendingUnassignListing.property_id) &&
      isAssigningAgent
    );
  }, [assigningPropertyId, isAssigningAgent, pendingUnassignListing]);

  const unassignConfirmModal = useMemo(
    () => {
      if (!enabled || !pendingUnassignListing) {
        return null;
      }

      return {
        open: true,
        title: t("unassignConfirmTitle"),
        description: t("unassignConfirmDescription", {
          title: resolveListingTitle(pendingUnassignListing, tableLocale),
        }),
        confirmLabel: t("workflow.unassign"),
        cancelLabel: t("cancelLabel"),
        unassigningLabel: t("unassigningLabel"),
        isLoading: isUnassigningPendingListing,
        onClose: closeUnassignConfirm,
        onConfirm: confirmUnassignListing,
      };
    },
    [
      closeUnassignConfirm,
      confirmUnassignListing,
      enabled,
      isUnassigningPendingListing,
      pendingUnassignListing,
      t,
      tableLocale,
    ],
  );

  const isDeactivatingPendingListing = useMemo(() => {
    if (!pendingDeactivateListing) {
      return false;
    }

    const submissionId = submissionIdByPropertyId.get(pendingDeactivateListing.property_id);

    return Boolean(submissionId && reviewingSubmissionId === submissionId && isDeactivatingSubmission);
  }, [
    isDeactivatingSubmission,
    pendingDeactivateListing,
    reviewingSubmissionId,
    submissionIdByPropertyId,
  ]);

  const deactivateConfirmModal = useMemo(
    () => {
      if (!enabled || !pendingDeactivateListing) {
        return null;
      }

      return {
        open: true,
        title: t("deactivateConfirmTitle"),
        description: t("deactivateConfirmDescription", {
          title: resolveListingTitle(pendingDeactivateListing, tableLocale),
        }),
        confirmLabel: t("workflow.deactivate"),
        cancelLabel: t("cancelLabel"),
        deactivatingLabel: t("deactivatingLabel"),
        isLoading: isDeactivatingPendingListing,
        onClose: closeDeactivateConfirm,
        onConfirm: confirmDeactivateListing,
      };
    },
    [
      closeDeactivateConfirm,
      confirmDeactivateListing,
      enabled,
      isDeactivatingPendingListing,
      pendingDeactivateListing,
      t,
      tableLocale,
    ],
  );

  const isAssigningPendingListing = useMemo(() => {
    if (!pendingAssignListing) {
      return false;
    }

    return (
      Boolean(assigningPropertyId === pendingAssignListing.property_id) &&
      isAssigningAgent
    );
  }, [assigningPropertyId, isAssigningAgent, pendingAssignListing]);

  const assignAgentModal = useMemo(
    () => {
      if (!enabled || !pendingAssignListing) {
        return null;
      }

      return {
        open: true,
        listingTitle: resolveListingTitle(pendingAssignListing, tableLocale),
        mode: assignAgentModalMode,
        isAssigning: isAssigningPendingListing,
        onClose: closeAssignModal,
        onAssign: onAssignAgent,
      };
    },
    [
      assignAgentModalMode,
      closeAssignModal,
      enabled,
      isAssigningPendingListing,
      onAssignAgent,
      pendingAssignListing,
      tableLocale,
    ],
  );

  // 7. Callbacks
  const onSearchChange = useCallback(() => {}, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: ManageListingToggleableColumnId, visible: boolean) => {
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

    fetchAdminPropertySubmissions(requestParams);
  }, [enabled, fetchAdminPropertySubmissions, requestParams]);

  // 10. Return values
  return {
    listings,
    tableListings,
    paginationMeta,
    requestParams,
    filters: {
      search: "",
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
      listingsNamespace: LISTINGS_NAMESPACE,
      showSearch: false,
      statusFilterValues: ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES,
    },
    sortConfig: activeSortConfig,
    onSort,
    tableLocale,
    pagination,
    noDataFound,
    workflowActions,
    onClickProperty,
    onClickDelete: openDeleteConfirm,
    onRowAction,
    columns,
    pinnedColumns,
    listTitle: t("pageTitle"),
    isLoading: enabled && (listings === null || isLoadingSubmissions),
    fetchAdminPropertySubmissions,
    rejectedReasonModal,
    approveConfirmModal,
    assignAgentModal,
    rejectSubmissionModal,
    unassignConfirmModal,
    deactivateConfirmModal,
    deleteConfirmModal,
    canViewDelete: true,
  };
}
