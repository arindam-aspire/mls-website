"use client";

import type { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PropertyView } from "@abdoun/abdoun-library";
import { useLocale, useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { tokenStore } from "@/src/apis/core/token.store";
import { useToast } from "@/src/hooks/useToast";
import {
  canTrackRecentPropertyView,
  isAgentUser,
  isAgencyUser,
  isSuperAdminUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { hasPropertyDetailsRestrictedTabsAccess } from "@/src/lib/auth/propertyDetailsTabAccess";
import { UserRole } from "@/src/lib/auth/roles";
import { PROPERTY_CREATE_SUBMISSION_ID_PARAM } from "../constants/propertyCreate.constants";
import {
  PROPERTY_DETAILS_DEFAULT_TAB,
  PROPERTY_DETAILS_PUBLIC_TAB_VALUES,
  PROPERTY_DETAILS_RESTRICTED_TAB_VALUES,
  PROPERTY_DETAILS_TAB,
  type PropertyDetailsTabValue,
} from "../constants/propertyDetailsTabs.constants";
import { mapFeatureCatalogItems } from "../mappers/propertyFeatures.mapper";
import { mapPropertyDetailsForPropertyView } from "../mappers/mapPropertyDetailsForPropertyView";
import {
  useAddRecentView,
  useAssignAdminPropertyAgent,
  useDeactivateAdminPropertySubmission,
  useGetPropertyDetails,
  useGetPropertyFeatureCatalog,
  useGetSimilarProperties,
  useReviewAdminPropertySubmission,
  useReviewDealClosure,
} from "../mutations/property.mutation";
import type { AssignAgentModalMode } from "../types/assignAgentModal.types";
import type {
  PropertyDetails,
  PropertyFeatureDefinition,
  PropertyListing,
  PropertyDetailsStatusActionCard,
  PropertyDetailsStatusActionCardAction,
} from "../types/property.types";
import { normalizePropertyListing } from "../utils/normalizePropertyListingStatus";
import {
  isPropertyCloseStatusKey,
  resolvePropertyClosePermissions,
} from "../utils/resolvePropertyClosePermissions";
import { usePropertyFavouriteToggle } from "./usePropertyFavouriteToggle";
import { usePropertyContactModalActions } from "@/src/features/contact/hooks/usePropertyContactModalActions";

type PropertyViewProps = ComponentProps<typeof PropertyView>;
type PropertyViewLocale = NonNullable<PropertyViewProps["locale"]>;

type PropertyDetailsConfirmAction =
  | "approve"
  | "unassign"
  | "deactivate"
  | "approve_deal_closure";

type PropertyDetailsRejectAction = "reject" | "reject_deal_closure";

const APPLICATION_KEY = "abdoun_web" as const;

const TAB_I18N_KEYS = {
  [PROPERTY_DETAILS_TAB.overview]: "tabs.overview",
  [PROPERTY_DETAILS_TAB.features]: "tabs.features",
  [PROPERTY_DETAILS_TAB.locations]: "tabs.locations",
  [PROPERTY_DETAILS_TAB.documents]: "tabs.documents",
} as const satisfies Record<PropertyDetailsTabValue, string>;

function toPropertyViewLocale(locale: AppLocale): PropertyViewLocale {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

function resolveActiveTab(
  searchParams: URLSearchParams,
  allowedTabValues: Set<string>,
) {
  const tab = searchParams.get("tab");

  if (tab && allowedTabValues.has(tab)) {
    return tab;
  }

  return PROPERTY_DETAILS_DEFAULT_TAB;
}

function resolveDetailsId(
  propertyDetails: PropertyDetails | null,
  propertyId: string,
) {
  const detailsId = (propertyDetails as { id?: number } | null)?.id;

  if (typeof detailsId === "number" && Number.isFinite(detailsId)) {
    return detailsId;
  }

  const parsedId = Number(propertyId);

  return Number.isFinite(parsedId) ? parsedId : 0;
}

function getPropertyDetailsStatusActionCard(
  propertyDetails: PropertyDetails | undefined,
): PropertyDetailsStatusActionCard | undefined {
  const card = propertyDetails?.status_action_card;
  const workflowActionLabels =
    propertyDetails?.workflow_actions
      ?.map((action) => action.label?.trim())
      .filter((label): label is string => Boolean(label)) ?? [];

  if (!card && workflowActionLabels.length === 0) {
    return undefined;
  }

  const statusLabel = (card?.statusLabel ?? card?.status_label)?.trim();
  const cardPendingActions = card?.pendingActions ?? card?.pending_actions ?? [];
  const pendingActions = (cardPendingActions.length > 0 ? cardPendingActions : workflowActionLabels)
    .map((action) => action.trim())
    .filter((action): action is string => Boolean(action));

  if (!statusLabel && pendingActions.length === 0) {
    return undefined;
  }

  return {
    statusLabel,
    pendingActions,
  };
}

function getLocalizedPropertyTitle(
  propertyDetails: PropertyDetails | undefined,
  locale: PropertyViewLocale,
): string {
  const title = propertyDetails?.title;

  if (!title) {
    return "this listing";
  }

  return title[locale]?.trim() || title.en?.trim() || "this listing";
}

export function usePropertyDetails(propertyId: string) {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appLocale = useLocale() as AppLocale;
  const locale = useMemo(() => toPropertyViewLocale(appLocale), [appLocale]);

  // 2. UI utilities
  const tDetails = useTranslations("propertyList.details");
  const tManage = useTranslations("propertyList.manageListings");
  const toast = useToast();

  // 3. Global state (Zustand)
  const user = useAuthStore((state) => state.user);
  const loggedInUserRole = useAuthStore((state) => state.loggedInUserRole);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const canViewRestrictedTabs = useMemo(
    () => hasPropertyDetailsRestrictedTabsAccess(user),
    [user],
  );

  const authenticatedRole = user?.roles?.[0]?.name ?? loggedInUserRole;
  const canViewLocationAndDocumentTabs = Boolean(
    authenticatedRole &&
      authenticatedRole !== UserRole.OWNER &&
      authenticatedRole !== UserRole.USER,
  );

  const canViewCloseStatus = useMemo(
    () => resolvePropertyClosePermissions(isAgencyUser(user) || isSuperAdminUser(user)).canViewCloseStatus,
    [user],
  );

  const showOwnerDetails =
    isAgentUser(user) || isAgencyUser(user) || isSuperAdminUser(user);

  const {
    withFavouriteFlags,
    withFavouriteLoading,
    toggleFavourite: toggleListingFavourite,
    toggleFavouriteById,
    applyDetailsFavouriteState,
    isDetailsFavouriteLoading,
  } = usePropertyFavouriteToggle();

  const {
    contactModal,
    openAgentEmail: openAgentEmailContact,
    openAgentPhone: openAgentPhoneContact,
    openAgentWhatsApp: openAgentWhatsAppContact,
    openOwnerEmail: openOwnerEmailContact,
    openOwnerPhone: openOwnerPhoneContact,
    openOwnerWhatsApp: openOwnerWhatsAppContact,
    onClickEmail: onSimilarClickEmail,
    onClickCall: onSimilarClickCall,
    onClickWhatsApp: onSimilarClickWhatsApp,
  } = usePropertyContactModalActions();

  // 4. Local state
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(
    null,
  );
  const [featureCatalog, setFeatureCatalog] = useState<
    PropertyFeatureDefinition[]
  >([]);
  const [isDetailsSettled, setIsDetailsSettled] = useState(false);
  const [isFeaturesSettled, setIsFeaturesSettled] = useState(false);
  const [similarListings, setSimilarListings] = useState<PropertyListing[]>([]);
  const [isSimilarSettled, setIsSimilarSettled] = useState(false);
  const [assignAgentModalMode, setAssignAgentModalMode] =
    useState<AssignAgentModalMode | null>(null);
  const [pendingConfirmAction, setPendingConfirmAction] =
    useState<PropertyDetailsConfirmAction | null>(null);
  const [pendingRejectAction, setPendingRejectAction] =
    useState<PropertyDetailsRejectAction | null>(null);
  const [runningWorkflowActionId, setRunningWorkflowActionId] =
    useState<string | null>(null);

  const tabOptions = useMemo(() => {
    const values: PropertyDetailsTabValue[] = [
      ...PROPERTY_DETAILS_PUBLIC_TAB_VALUES,
    ];

    if (canViewLocationAndDocumentTabs) {
      values.push(...PROPERTY_DETAILS_RESTRICTED_TAB_VALUES);
    } else if (propertyDetails?.show_location === true) {
      values.push(PROPERTY_DETAILS_TAB.locations);
    }

    return values.map((value) => ({
      label: tDetails(TAB_I18N_KEYS[value]),
      value,
    }));
  }, [canViewLocationAndDocumentTabs, propertyDetails?.show_location, tDetails]);

  const allowedTabValues = useMemo(
    () => new Set<string>(tabOptions.map((tab) => tab.value)),
    [tabOptions],
  );

  const activeTab = useMemo(
    () => resolveActiveTab(searchParams, allowedTabValues),
    [allowedTabValues, searchParams],
  );

  // 5. Data fetching / queries
  const {
    mutate: fetchPropertyDetails,
    isPending: isLoadingDetails,
    isError,
  } = useGetPropertyDetails();

  const {
    mutate: fetchFeatureCatalog,
    isPending: isLoadingFeatures,
  } = useGetPropertyFeatureCatalog();

  const {
    mutate: fetchSimilarProperties,
    isPending: isLoadingSimilar,
  } = useGetSimilarProperties();

  const { mutate: addRecentView } = useAddRecentView();
  const { mutate: reviewAdminPropertySubmission, isPending: isReviewingSubmission } =
    useReviewAdminPropertySubmission();
  const { mutate: deactivateAdminPropertySubmission, isPending: isDeactivatingSubmission } =
    useDeactivateAdminPropertySubmission();
  const { mutate: assignAdminPropertyAgent, isPending: isAssigningAgent } =
    useAssignAdminPropertyAgent();
  const { mutate: reviewDealClosure, isPending: isReviewingDealClosure } =
    useReviewDealClosure();

  const loadPropertyDetails = useCallback(() => {
    fetchPropertyDetails(propertyId, {
      onSuccess: (response) => {
        setPropertyDetails(response.data ?? null);
      },
      onSettled: () => {
        setIsDetailsSettled(true);
      },
    });
  }, [fetchPropertyDetails, propertyId]);

  const loadFeatureCatalog = useCallback(() => {
    fetchFeatureCatalog(undefined, {
      onSuccess: (response) => {
        setFeatureCatalog(
          mapFeatureCatalogItems(response.data?.items ?? []),
        );
      },
      onSettled: () => {
        setIsFeaturesSettled(true);
      },
    });
  }, [fetchFeatureCatalog]);

  const loadSimilarProperties = useCallback(() => {
    fetchSimilarProperties(propertyId, {
      onSuccess: (response) => {
        setSimilarListings(
          (response.data?.items ?? []).map((item) => normalizePropertyListing(item)),
        );
      },
      onSettled: () => {
        setIsSimilarSettled(true);
      },
    });
  }, [fetchSimilarProperties, propertyId]);

  // 6. Derived / memoized values
  const isLoading =
    !isDetailsSettled || !isFeaturesSettled || isLoadingDetails || isLoadingFeatures;

  const isSimilarLoading = !isSimilarSettled || isLoadingSimilar;

  const similarListingsWithFavourites = useMemo(
    () => withFavouriteLoading(withFavouriteFlags(similarListings)),
    [similarListings, withFavouriteFlags, withFavouriteLoading],
  );

  const propertyDetailsWithFavourites = useMemo(() => {
    if (!propertyDetails) {
      return undefined;
    }

    const detailsWithId = {
      ...propertyDetails,
      id: resolveDetailsId(propertyDetails, propertyId),
    };

    const favouriteDetails = applyDetailsFavouriteState(detailsWithId, propertyId);

    if (!favouriteDetails) {
      return undefined;
    }

    return mapPropertyDetailsForPropertyView(favouriteDetails);
  }, [applyDetailsFavouriteState, propertyDetails, propertyId]);

  const guardDetails = useMemo(() => {
    const name = propertyDetailsWithFavourites?.guard_name?.trim();
    const number = (
      propertyDetailsWithFavourites?.guard_phone_number ??
      propertyDetailsWithFavourites?.guard_number
    )?.trim();

    if (!name || !number) {
      return null;
    }

    return {
      name,
      number,
      title: tDetails("guard.title"),
      nameLabel: tDetails("guard.name"),
      numberLabel: tDetails("guard.number"),
    };
  }, [propertyDetailsWithFavourites, tDetails]);

  const showAgentDetails = Boolean(propertyDetailsWithFavourites?.agent);

  const detailPropertyId = propertyDetailsWithFavourites?.property_id?.trim() ?? "";
  const detailSubmissionId = propertyDetailsWithFavourites?.submission_id?.trim() ?? "";
  const detailDealClosureId = propertyDetailsWithFavourites?.deal_closure_id?.trim() ?? "";
  const detailTitle = useMemo(
    () => getLocalizedPropertyTitle(propertyDetailsWithFavourites, locale),
    [locale, propertyDetailsWithFavourites],
  );
  const isWorkflowActionPending =
    isReviewingSubmission ||
    isDeactivatingSubmission ||
    isAssigningAgent ||
    isReviewingDealClosure;

  const isFavouriteLoading = useMemo(() => {
    if (!propertyDetailsWithFavourites) {
      return false;
    }

    return isDetailsFavouriteLoading(
      {
        id: propertyDetailsWithFavourites.id,
        property_hash: (
          propertyDetailsWithFavourites as { property_hash?: string }
        ).property_hash,
      },
      propertyId,
    );
  }, [isDetailsFavouriteLoading, propertyDetailsWithFavourites, propertyId]);

  const onTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (tab === PROPERTY_DETAILS_DEFAULT_TAB) {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const tabs = useMemo(
    () => ({
      tabOptions,
      activeTab,
      onTabChange,
    }),
    [activeTab, onTabChange, tabOptions],
  );

  // 7. Callbacks
  const toggleFavourite = useCallback(
    (target: PropertyListing | number) => {
      if (typeof target === "number") {
        const detailsId = propertyDetailsWithFavourites?.id;

        if (detailsId === target && propertyDetailsWithFavourites) {
          toggleListingFavourite({
            id: target,
            is_favourite: Boolean(
              (propertyDetailsWithFavourites as { is_favourite?: boolean })
                .is_favourite,
            ),
            property_hash: (
              propertyDetailsWithFavourites as { property_hash?: string }
            ).property_hash,
          } as PropertyListing);
          return;
        }

        toggleFavouriteById(target, { listings: similarListingsWithFavourites });
        return;
      }

      toggleListingFavourite(target);
    },
    [
      propertyDetailsWithFavourites,
      similarListingsWithFavourites,
      toggleFavouriteById,
      toggleListingFavourite,
    ],
  );

  const openAgentEmail = useCallback(
    (_id: number) => {
      openAgentEmailContact(propertyDetailsWithFavourites);
    },
    [openAgentEmailContact, propertyDetailsWithFavourites],
  );

  const openAgentPhone = useCallback(
    (_id: number) => {
      openAgentPhoneContact(propertyDetailsWithFavourites);
    },
    [openAgentPhoneContact, propertyDetailsWithFavourites],
  );

  const openAgentWhatsApp = useCallback(
    (_id: number) => {
      openAgentWhatsAppContact(propertyDetailsWithFavourites);
    },
    [openAgentWhatsAppContact, propertyDetailsWithFavourites],
  );

  const openOwnerEmail = useCallback(
    (_propertyId: number, ownerId?: number) => {
      openOwnerEmailContact(propertyDetailsWithFavourites, ownerId);
    },
    [openOwnerEmailContact, propertyDetailsWithFavourites],
  );

  const openOwnerPhone = useCallback(
    (_propertyId: number, ownerId?: number) => {
      openOwnerPhoneContact(propertyDetailsWithFavourites, ownerId);
    },
    [openOwnerPhoneContact, propertyDetailsWithFavourites],
  );

  const openOwnerWhatsApp = useCallback(
    (_propertyId: number, ownerId?: number) => {
      openOwnerWhatsAppContact(propertyDetailsWithFavourites, ownerId);
    },
    [openOwnerWhatsAppContact, propertyDetailsWithFavourites],
  );

  const showMissingWorkflowContext = useCallback(
    (message = "The selected workflow action cannot be completed because required details are missing.") => {
      toast.error("Action unavailable", {
        description: message,
      });
    },
    [toast],
  );

  const refreshDetailsAfterWorkflowAction = useCallback(() => {
    setIsDetailsSettled(false);
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  const closeAssignAgentModal = useCallback(() => {
    if (isAssigningAgent) {
      return;
    }

    setAssignAgentModalMode(null);
  }, [isAssigningAgent]);

  const onAssignAgent = useCallback(
    (agentId: string) => {
      if (!detailPropertyId || !assignAgentModalMode || isAssigningAgent) {
        if (!detailPropertyId) {
          showMissingWorkflowContext("Property id is missing for agent assignment.");
        }
        return;
      }

      const actionId = assignAgentModalMode === "reassign" ? "reassign" : "assign";
      setRunningWorkflowActionId(actionId);

      assignAdminPropertyAgent(
        {
          propertyId: detailPropertyId,
          body: { agent_id: agentId },
        },
        {
          onSuccess: (response) => {
            const isReassign = assignAgentModalMode === "reassign";

            toast.success(
              isReassign ? tManage("reassignAgentSuccessTitle") : tManage("assignAgentSuccessTitle"),
              {
                description:
                  response.message ??
                  (isReassign
                    ? tManage("reassignAgentSuccessDescription")
                    : tManage("assignAgentSuccessDescription")),
              },
            );
            setRunningWorkflowActionId(null);
            setAssignAgentModalMode(null);
            refreshDetailsAfterWorkflowAction();
          },
          onError: (error) => {
            const apiError = error as unknown as ApiError;
            setRunningWorkflowActionId(null);
            toast.error(tManage("assignAgentError"), {
              description: apiError.message,
            });
          },
        },
      );
    },
    [
      assignAdminPropertyAgent,
      assignAgentModalMode,
      detailPropertyId,
      isAssigningAgent,
      refreshDetailsAfterWorkflowAction,
      showMissingWorkflowContext,
      tManage,
      toast,
    ],
  );

  const closeWorkflowConfirmModal = useCallback(() => {
    if (isWorkflowActionPending) {
      return;
    }

    setPendingConfirmAction(null);
  }, [isWorkflowActionPending]);

  const closeRejectWorkflowModal = useCallback(() => {
    if (isWorkflowActionPending) {
      return;
    }

    setPendingRejectAction(null);
  }, [isWorkflowActionPending]);

  const confirmWorkflowAction = useCallback(() => {
    if (!pendingConfirmAction || isWorkflowActionPending) {
      return;
    }

    if (pendingConfirmAction === "approve") {
      if (!detailSubmissionId) {
        showMissingWorkflowContext("Submission id is missing for approval.");
        return;
      }

      setRunningWorkflowActionId("approve");
      reviewAdminPropertySubmission(
        {
          submissionId: detailSubmissionId,
          body: { action: "approve" },
        },
        {
          onSuccess: (response) => {
            toast.success(tManage("approveSuccessTitle"), {
              description: response.message ?? tManage("approveSuccessDescription"),
            });
            setRunningWorkflowActionId(null);
            setPendingConfirmAction(null);
            refreshDetailsAfterWorkflowAction();
          },
          onError: (error) => {
            const apiError = error as unknown as ApiError;
            setRunningWorkflowActionId(null);
            toast.error(tManage("approveError"), {
              description: apiError.message,
            });
          },
        },
      );
      return;
    }

    if (pendingConfirmAction === "unassign") {
      if (!detailPropertyId) {
        showMissingWorkflowContext("Property id is missing for agent unassignment.");
        return;
      }

      setRunningWorkflowActionId("unassign");
      assignAdminPropertyAgent(
        {
          propertyId: detailPropertyId,
          body: { agent_id: null },
        },
        {
          onSuccess: (response) => {
            toast.success(tManage("unassignSuccessTitle"), {
              description: response.message ?? tManage("unassignSuccessDescription"),
            });
            setRunningWorkflowActionId(null);
            setPendingConfirmAction(null);
            refreshDetailsAfterWorkflowAction();
          },
          onError: (error) => {
            const apiError = error as unknown as ApiError;
            setRunningWorkflowActionId(null);
            toast.error(tManage("unassignError"), {
              description: apiError.message,
            });
          },
        },
      );
      return;
    }

    if (pendingConfirmAction === "deactivate") {
      if (!detailSubmissionId) {
        showMissingWorkflowContext("Submission id is missing for deactivation.");
        return;
      }

      setRunningWorkflowActionId("deactivate");
      deactivateAdminPropertySubmission(detailSubmissionId, {
        onSuccess: (response) => {
          toast.success(tManage("deactivateSuccessTitle"), {
            description: response.message ?? tManage("deactivateSuccessDescription"),
          });
          setRunningWorkflowActionId(null);
          setPendingConfirmAction(null);
          refreshDetailsAfterWorkflowAction();
        },
        onError: (error) => {
          const apiError = error as unknown as ApiError;
          setRunningWorkflowActionId(null);
          toast.error(tManage("deactivateError"), {
            description: apiError.message,
          });
        },
      });
      return;
    }

    if (pendingConfirmAction === "approve_deal_closure") {
      if (!detailDealClosureId) {
        showMissingWorkflowContext("Deal closure id is missing for review.");
        return;
      }

      setRunningWorkflowActionId("approve_deal_closure");
      reviewDealClosure(
        {
          closureId: detailDealClosureId,
          body: { action: "approve" },
        },
        {
          onSuccess: (response) => {
            toast.success("Deal closure approved", {
              description: response.message ?? "The deal closure request was approved.",
            });
            setRunningWorkflowActionId(null);
            setPendingConfirmAction(null);
            refreshDetailsAfterWorkflowAction();
          },
          onError: (error) => {
            const apiError = error as unknown as ApiError;
            setRunningWorkflowActionId(null);
            toast.error("Failed to approve deal closure", {
              description: apiError.message,
            });
          },
        },
      );
    }
  }, [
    assignAdminPropertyAgent,
    deactivateAdminPropertySubmission,
    detailDealClosureId,
    detailPropertyId,
    detailSubmissionId,
    isWorkflowActionPending,
    pendingConfirmAction,
    refreshDetailsAfterWorkflowAction,
    reviewAdminPropertySubmission,
    reviewDealClosure,
    showMissingWorkflowContext,
    tManage,
    toast,
  ]);

  const confirmRejectWorkflowAction = useCallback(
    (reason: string) => {
      if (!pendingRejectAction || isWorkflowActionPending) {
        return;
      }

      if (pendingRejectAction === "reject") {
        if (!detailSubmissionId) {
          showMissingWorkflowContext("Submission id is missing for rejection.");
          return;
        }

        setRunningWorkflowActionId("reject");
        reviewAdminPropertySubmission(
          {
            submissionId: detailSubmissionId,
            body: { action: "reject", reason },
          },
          {
            onSuccess: (response) => {
              toast.success(tManage("rejectSuccessTitle"), {
                description: response.message ?? tManage("rejectSuccessDescription"),
              });
              setRunningWorkflowActionId(null);
              setPendingRejectAction(null);
              refreshDetailsAfterWorkflowAction();
            },
            onError: (error) => {
              const apiError = error as unknown as ApiError;
              setRunningWorkflowActionId(null);
              toast.error(tManage("rejectError"), {
                description: apiError.message,
              });
            },
          },
        );
        return;
      }

      if (!detailDealClosureId) {
        showMissingWorkflowContext("Deal closure id is missing for review.");
        return;
      }

      setRunningWorkflowActionId("reject_deal_closure");
      reviewDealClosure(
        {
          closureId: detailDealClosureId,
          body: { action: "reject", reason },
        },
        {
          onSuccess: (response) => {
            toast.success("Deal closure rejected", {
              description: response.message ?? "The deal closure request was rejected.",
            });
            setRunningWorkflowActionId(null);
            setPendingRejectAction(null);
            refreshDetailsAfterWorkflowAction();
          },
          onError: (error) => {
            const apiError = error as unknown as ApiError;
            setRunningWorkflowActionId(null);
            toast.error("Failed to reject deal closure", {
              description: apiError.message,
            });
          },
        },
      );
    },
    [
      detailDealClosureId,
      detailSubmissionId,
      isWorkflowActionPending,
      pendingRejectAction,
      refreshDetailsAfterWorkflowAction,
      reviewAdminPropertySubmission,
      reviewDealClosure,
      showMissingWorkflowContext,
      tManage,
      toast,
    ],
  );

  const onStatusWorkflowActionClick = useCallback(
    (actionId: string) => {
      if (isWorkflowActionPending) {
        return;
      }

      if (actionId === "assign") {
        setAssignAgentModalMode("assign");
        return;
      }

      if (actionId === "reassign") {
        setAssignAgentModalMode("reassign");
        return;
      }

      if (actionId === "approve") {
        setPendingConfirmAction("approve");
        return;
      }

      if (actionId === "reject") {
        setPendingRejectAction("reject");
        return;
      }

      if (actionId === "unassign") {
        setPendingConfirmAction("unassign");
        return;
      }

      if (actionId === "deactivate") {
        setPendingConfirmAction("deactivate");
        return;
      }

      if (actionId === "approve_deal_closure") {
        setPendingConfirmAction("approve_deal_closure");
        return;
      }

      if (actionId === "reject_deal_closure") {
        setPendingRejectAction("reject_deal_closure");
        return;
      }

      if (actionId === "edit") {
        if (!detailSubmissionId) {
          showMissingWorkflowContext("Submission id is missing for editing.");
          return;
        }

        router.push(
          `/property-create?${PROPERTY_CREATE_SUBMISSION_ID_PARAM}=${encodeURIComponent(detailSubmissionId)}`,
        );
      }
    },
    [
      detailSubmissionId,
      isWorkflowActionPending,
      router,
      showMissingWorkflowContext,
    ],
  );

  const workflowActionButtons = useMemo<PropertyDetailsStatusActionCardAction[]>(() => {
    const actions = propertyDetailsWithFavourites?.workflow_actions ?? [];

    return actions.flatMap((action): PropertyDetailsStatusActionCardAction[] => {
      if (action.hidden) {
        return [];
      }

      if (action.id === "review_deal_closure") {
        if (!canViewCloseStatus) {
          return [];
        }

        return [
          {
            id: "approve_deal_closure",
            label: "Approve Deal Closure",
            tone: "success",
            disabled: isWorkflowActionPending || !detailDealClosureId,
            isLoading:
              runningWorkflowActionId === "approve_deal_closure" &&
              isReviewingDealClosure,
            loadingLabel: "Approving...",
            onClick: () => onStatusWorkflowActionClick("approve_deal_closure"),
          },
          {
            id: "reject_deal_closure",
            label: "Reject Deal Closure",
            tone: "danger",
            disabled: isWorkflowActionPending || !detailDealClosureId,
            isLoading:
              runningWorkflowActionId === "reject_deal_closure" &&
              isReviewingDealClosure,
            loadingLabel: "Rejecting...",
            onClick: () => onStatusWorkflowActionClick("reject_deal_closure"),
          },
        ];
      }

      const actionLabels: Record<string, string> = {
        assign: tManage("workflow.assignAgent"),
        approve: tManage("workflow.approve"),
        deactivate: tManage("workflow.deactivate"),
        edit: tManage("workflow.edit"),
        reject: tManage("workflow.reject"),
        reassign: tManage("workflow.reassign"),
        unassign: tManage("workflow.unassign"),
      };

      if (!Object.prototype.hasOwnProperty.call(actionLabels, action.id)) {
        return [];
      }

      const requiresSubmissionId = ["approve", "reject", "deactivate", "edit"].includes(
        action.id,
      );
      const requiresPropertyId = ["assign", "reassign", "unassign"].includes(action.id);
      const missingRequiredContext =
        (requiresSubmissionId && !detailSubmissionId) ||
        (requiresPropertyId && !detailPropertyId);
      const tone =
        action.tone === "danger" || action.id === "reject" || action.id === "unassign" || action.id === "deactivate"
          ? "danger"
          : action.id === "approve"
            ? "success"
            : "default";
      const loadingByAction: Record<string, boolean> = {
        assign: runningWorkflowActionId === "assign" && isAssigningAgent,
        reassign: runningWorkflowActionId === "reassign" && isAssigningAgent,
        unassign: runningWorkflowActionId === "unassign" && isAssigningAgent,
        approve: runningWorkflowActionId === "approve" && isReviewingSubmission,
        reject: runningWorkflowActionId === "reject" && isReviewingSubmission,
        deactivate:
          runningWorkflowActionId === "deactivate" && isDeactivatingSubmission,
        edit: false,
      };

      return [
        {
          id: action.id,
          label: action.label?.trim() || actionLabels[action.id],
          tone,
          disabled:
            Boolean(action.disabled) ||
            isWorkflowActionPending ||
            missingRequiredContext,
          isLoading: loadingByAction[action.id] ?? false,
          loadingLabel:
            action.id === "assign"
              ? tManage("assignAgentModal.assigningLabel")
              : action.id === "reassign"
                ? tManage("assignAgentModal.reassigningLabel")
                : action.id === "unassign"
                  ? tManage("unassigningLabel")
                  : action.id === "approve"
                    ? tManage("approvingLabel")
                    : action.id === "reject"
                      ? tManage("rejectSubmissionModal.submittingLabel")
                      : action.id === "deactivate"
                        ? tManage("deactivatingLabel")
                        : undefined,
          onClick: () => onStatusWorkflowActionClick(action.id),
        },
      ];
    });
  }, [
    detailDealClosureId,
    detailPropertyId,
    detailSubmissionId,
    isAssigningAgent,
    isDeactivatingSubmission,
    isReviewingDealClosure,
    isReviewingSubmission,
    isWorkflowActionPending,
    onStatusWorkflowActionClick,
    canViewCloseStatus,
    propertyDetailsWithFavourites?.workflow_actions,
    runningWorkflowActionId,
    tManage,
  ]);

  const statusActionCard = useMemo(() => {
    const card = getPropertyDetailsStatusActionCard(propertyDetailsWithFavourites);

    if (!card && workflowActionButtons.length === 0) {
      return undefined;
    }

    const fallbackPendingActions = workflowActionButtons
      .map((action) => action.label?.trim())
      .filter((label): label is string => Boolean(label));
    const cardPendingActions = card?.pendingActions ?? card?.pending_actions ?? [];

    const rawStatusLabel = card?.statusLabel ?? card?.status_label ?? undefined;
    const listingCloseStatus = [
      propertyDetailsWithFavourites?.workflow_status,
      propertyDetailsWithFavourites?.workflow_stage,
      rawStatusLabel,
    ].some((value) => value && isPropertyCloseStatusKey(value));

    return {
      statusLabel:
        canViewCloseStatus || !listingCloseStatus ? rawStatusLabel : undefined,
      pendingActions:
        cardPendingActions.length > 0 ? cardPendingActions : fallbackPendingActions,
      actions: workflowActionButtons,
    };
  }, [canViewCloseStatus, propertyDetailsWithFavourites, workflowActionButtons]);

  // 8. Refs
  const lastRecordedRecentViewIdRef = useRef<string | null>(null);

  const workflowConfirmModal = useMemo(() => {
    if (!pendingConfirmAction) {
      return null;
    }

    const base = {
      open: true,
      cancelLabel: tManage("cancelLabel"),
      onClose: closeWorkflowConfirmModal,
      onConfirm: confirmWorkflowAction,
    };

    if (pendingConfirmAction === "approve") {
      return {
        ...base,
        variant: "primary" as const,
        title: tManage("approveConfirmTitle"),
        description: tManage("approveConfirmDescription", { title: detailTitle }),
        confirmLabel: tManage("workflow.approve"),
        loadingLabel: tManage("approvingLabel"),
        isLoading:
          runningWorkflowActionId === "approve" && isReviewingSubmission,
      };
    }

    if (pendingConfirmAction === "unassign") {
      return {
        ...base,
        variant: "danger" as const,
        title: tManage("unassignConfirmTitle"),
        description: tManage("unassignConfirmDescription", { title: detailTitle }),
        confirmLabel: tManage("workflow.unassign"),
        loadingLabel: tManage("unassigningLabel"),
        isLoading:
          runningWorkflowActionId === "unassign" && isAssigningAgent,
      };
    }

    if (pendingConfirmAction === "deactivate") {
      return {
        ...base,
        variant: "danger" as const,
        title: tManage("deactivateConfirmTitle"),
        description: tManage("deactivateConfirmDescription", { title: detailTitle }),
        confirmLabel: tManage("workflow.deactivate"),
        loadingLabel: tManage("deactivatingLabel"),
        isLoading:
          runningWorkflowActionId === "deactivate" && isDeactivatingSubmission,
      };
    }

    return {
      ...base,
      variant: "success" as const,
      title: "Approve deal closure?",
      description: `"${detailTitle}" will be marked as deal closed.`,
      confirmLabel: "Approve Deal Closure",
      loadingLabel: "Approving...",
      isLoading:
        runningWorkflowActionId === "approve_deal_closure" &&
        isReviewingDealClosure,
    };
  }, [
    closeWorkflowConfirmModal,
    confirmWorkflowAction,
    detailTitle,
    isAssigningAgent,
    isDeactivatingSubmission,
    isReviewingDealClosure,
    isReviewingSubmission,
    pendingConfirmAction,
    runningWorkflowActionId,
    tManage,
  ]);

  const rejectWorkflowModal = useMemo(() => {
    if (!pendingRejectAction) {
      return null;
    }

    const isDealClosureReject = pendingRejectAction === "reject_deal_closure";

    return {
      open: true,
      listingTitle: detailTitle,
      isSubmitting:
        runningWorkflowActionId === pendingRejectAction &&
        (isDealClosureReject ? isReviewingDealClosure : isReviewingSubmission),
      onClose: closeRejectWorkflowModal,
      onSubmit: confirmRejectWorkflowAction,
      ...(isDealClosureReject
        ? {
            title: "Reject deal closure?",
            description: `Provide a reason for rejecting the deal closure request for "${detailTitle}".`,
            reasonLabel: "Rejection reason",
            reasonPlaceholder: "Explain why this deal closure request is being rejected...",
            submitLabel: "Reject Deal Closure",
            submittingLabel: "Rejecting...",
          }
        : {}),
    };
  }, [
    closeRejectWorkflowModal,
    confirmRejectWorkflowAction,
    detailTitle,
    isReviewingDealClosure,
    isReviewingSubmission,
    pendingRejectAction,
    runningWorkflowActionId,
  ]);

  const assignAgentModal = useMemo(() => {
    if (!assignAgentModalMode) {
      return null;
    }

    return {
      open: true,
      listingTitle: detailTitle,
      mode: assignAgentModalMode,
      isAssigning:
        (runningWorkflowActionId === "assign" ||
          runningWorkflowActionId === "reassign") &&
        isAssigningAgent,
      onClose: closeAssignAgentModal,
      onAssign: onAssignAgent,
    };
  }, [
    assignAgentModalMode,
    closeAssignAgentModal,
    detailTitle,
    isAssigningAgent,
    onAssignAgent,
    runningWorkflowActionId,
  ]);

  // 9. Effects
  useEffect(() => {
    lastRecordedRecentViewIdRef.current = null;
  }, [propertyId]);

  useEffect(() => {
    if (!isDetailsSettled || !propertyDetails) {
      return;
    }

    if (!tokenStore.getAccessToken()) {
      return;
    }

    if (isLoadingUser && !loggedInUserRole && !user?.roles?.[0]?.name) {
      return;
    }

    if (!canTrackRecentPropertyView(user, loggedInUserRole)) {
      return;
    }

    if (lastRecordedRecentViewIdRef.current === propertyId) {
      return;
    }

    const propertyHash = Number(propertyId);

    if (!Number.isFinite(propertyHash) || propertyHash <= 0) {
      return;
    }

    lastRecordedRecentViewIdRef.current = propertyId;
    addRecentView({ property_hash_id: propertyHash });
  }, [
    addRecentView,
    isDetailsSettled,
    isLoadingUser,
    loggedInUserRole,
    propertyDetails,
    propertyId,
    user,
  ]);

  useEffect(() => {
    setIsFeaturesSettled(false);
    loadFeatureCatalog();
  }, [loadFeatureCatalog]);

  useEffect(() => {
    setPropertyDetails(null);
    setIsDetailsSettled(false);
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  useEffect(() => {
    setSimilarListings([]);
    setIsSimilarSettled(false);
    loadSimilarProperties();
  }, [loadSimilarProperties]);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (!tab || allowedTabValues.has(tab)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("tab");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [allowedTabValues, pathname, router, searchParams]);

  // 10. Return values
  return {
    isLoading,
    isError,
    propertyDetails: propertyDetailsWithFavourites,
    guardDetails,
    isFavouriteLoading,
    locale,
    applicationKey: APPLICATION_KEY,
    featureCatalog,
    tabs,
    canViewRestrictedTabs,
    showOwnerDetails,
    showAgentDetails,
    toggleFavourite,
    openAgentEmail,
    openAgentPhone,
    openAgentWhatsApp,
    openOwnerEmail,
    openOwnerPhone,
    openOwnerWhatsApp,
    similarListings: similarListingsWithFavourites,
    isSimilarLoading,
    onSimilarClickEmail,
    onSimilarClickCall,
    onSimilarClickWhatsApp,
    statusActionCard,
    workflowConfirmModal,
    rejectWorkflowModal,
    assignAgentModal,
    contactModal,
  };
}
