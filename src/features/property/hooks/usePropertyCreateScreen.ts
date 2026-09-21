"use client";

import type { BreadcrumbItem } from "@/src/components/ui/breadcrumb";
import type { SelectOption } from "@/src/components/ui/select/types";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  isAgentUser,
  isOwnerUser,
  isSuperAdminUser,
  resolveListingsMenuPath,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import {
  useGetLocationTaxonomy,
  useGetPropertyTaxonomy,
} from "@/src/features/landing/mutations/landing.mutation";
import {
  getLocationCities,
  type LocationTaxonomyResponse,
} from "@/src/features/landing/types/locationTaxonomy.types";
import {
  getPropertyCategories,
  type PropertyTaxonomyResponse,
} from "@/src/features/landing/types/propertyTaxonomy.types";
import {
  PROPERTY_CREATE_AGENCY_ID_PARAM,
  PROPERTY_CREATE_SUBMISSION_ID_PARAM,
} from "@/src/features/property/constants/propertyCreate.constants";
import {
  INITIAL_PROPERTY_FORM_ACTIVE_STEP,
  INITIAL_PROPERTY_FORM_VALUES,
} from "@/src/features/property/constants/propertyForm.constants";
import {
  DEFAULT_AGENCY_CURRENCY,
  type AgencyCurrency,
} from "@/src/features/profile/constants/agencyPreferences";
import {
  getAgencyById,
  getAgencyList,
} from "@/src/features/profile/services/profile.service";
import {
  normalizeAgencyCurrency,
} from "@/src/features/profile/utils/agencyPreferences.utils";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  buildPropertyDraftSubmissionRequestBody,
  buildPropertyDraftSubmissionUpdateRequestBody,
  buildPropertySubmissionDirectSubmitRequestBody,
  extractPropertyFormDls,
  getPropertyFormShowLocation,
  mapPropertyDraftSubmissionToPropertyFormValues,
  toPropertyDraftSubmissionCurrency,
  withPropertyFormHostLocationFields,
  withPropertyFormShowLocation,
  getDraftFloorValue,
} from "@/src/features/property/mappers/propertyDraftSubmission.mapper";
import { buildPropertyLocationDlsLabels } from "@/src/features/property/i18n/propertyLocationDls.i18n";
import { usePropertyLocationDls } from "@/src/features/property/hooks/usePropertyLocationDls";
import type { PropertyLocationDlsSelection } from "@/src/features/property/types/dls.types";
import {
  mapFeatureCatalogForPropertyForm,
  mapLocationTaxonomyForPropertyForm,
  mapPropertyCategoriesForPropertyForm,
} from "@/src/features/property/mappers/propertyForm.mapper";
import { buildPropertyFormConfig } from "@/src/features/property/i18n/buildPropertyFormConfig";
import { useOwnerDocumentUpload } from "@/src/features/property/hooks/useOwnerDocumentUpload";
import { buildPropertyCreateOwnerInfoValidationMessages } from "@/src/features/property/i18n/propertyCreateOwnerInfo.i18n";
import { usePropertyCreateUnsavedChanges } from "@/src/features/property/hooks/usePropertyCreateUnsavedChanges";
import { usePropertyMediaUpload } from "@/src/features/property/hooks/usePropertyMediaUpload";
import { usePropertyOwnerSearch } from "@/src/features/property/hooks/usePropertyOwnerSearch";
import {
  useGetPropertyDraftSubmission,
  useGetPropertyFeatureCatalog,
  useGetPropertyFormOptions,
  useSavePropertyDraftSubmission,
  useSubmitPropertyDraftSubmission,
  useSubmitPropertySubmission,
  useUpdatePropertyDraftSubmission,
} from "@/src/features/property/mutations/property.mutation";
import {
  EMPTY_PROPERTY_FORM_OPTIONS_CATALOG,
  mapPropertyFormOptionsCatalog,
  withPropertyFormOptionFallbacks,
  withEnsuredFloorOption,
} from "@/src/features/property/mappers/propertyFormOptions.mapper";
import type { FeatureCatalogItem } from "@/src/features/property/types/property.types";
import type { PropertyFormOptionsCatalog } from "@/src/features/property/types/propertyFormOptions.types";
import type { PropertyDraftSubmissionData } from "@/src/features/property/types/propertyDraftSubmission.types";
import { applyPropertyCreateFormDomPatches } from "@/src/features/property/utils/propertyCreateFormDom.utils";
import {
  getHostLocationFieldError,
  omitHostLocationFieldErrors,
  parsePropertySubmissionError,
} from "@/src/features/property/utils/propertySubmissionError.utils";
import {
  buildLoggedInOwnerInfoItem,
  buildPropertyCreateOwnerInfoConfig,
  hasOwnerInfoRowContent,
  resolveReadOnlyOwnerIndicesForLoggedInOwner,
} from "@/src/features/property/utils/propertyCreateOwnerInfo.utils";
import {
  propertyFormSteps,
  type OwnerInfoConfig,
  type PropertyFormExternalErrors,
  type PropertyFormHandle,
  type PropertyFormStep,
  type PropertyFormValues,
} from "@abdoun/abdoun-library";
import { useToast } from "@/src/hooks/useToast";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

function normalizePropertyCreateAgencyId(
  value: string | number | null | undefined,
): string | null {
  if (value == null) {
    return null;
  }

  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function shouldShowPropertyCreateAgencyField(
  user: LoggedInUser | null | undefined,
): boolean {
  return isSuperAdminUser(user) || isOwnerUser(user);
}

function resolveSubmitSuccessDescription(
  data: PropertyDraftSubmissionData | null | undefined,
  apiMessage: string | null | undefined,
  copy: {
    isOwner: boolean;
    pendingAdmin: string;
    pendingAgency: string;
  },
): string | undefined {
  const message = apiMessage?.trim();
  if (message) {
    return message;
  }

  if (!copy.isOwner) {
    return undefined;
  }

  const status = normalizeSubmissionStatusToken(data?.status);
  const workflowStage = normalizeSubmissionStatusToken(data?.workflow_stage);

  if (
    status === "pending-admin-approval" ||
    workflowStage === "pending-admin-approval"
  ) {
    return copy.pendingAdmin;
  }

  if (
    status === "pending-approval" ||
    workflowStage === "pending-approval" ||
    status === "submitted"
  ) {
    return copy.pendingAgency;
  }

  return undefined;
}

function getLocationTaxonomyTotal(
  taxonomy: LocationTaxonomyResponse | null,
): number | undefined {
  const payload = taxonomy?.data;

  if (payload == null || Array.isArray(payload)) {
    return undefined;
  }

  return payload.total;
}

function normalizeSubmissionStatusToken(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

function resolveApiCanEditSubmission(
  data: PropertyDraftSubmissionData,
): boolean | null {
  if (typeof data.can_edit === "boolean") {
    return data.can_edit;
  }

  if (typeof data.can_edit_submission === "boolean") {
    return data.can_edit_submission;
  }

  return null;
}

function resolveSubmissionFormAccess(
  data: PropertyDraftSubmissionData,
  user: LoggedInUser | null | undefined,
) {
  const status = normalizeSubmissionStatusToken(data.status);
  const workflowStage = normalizeSubmissionStatusToken(data.workflow_stage);
  const userId = user?.id ? String(user.id) : "";
  const submittedBy = data.submitted_by ? String(data.submitted_by) : "";
  const assignedAgentId = data.assigned_agent_id
    ? String(data.assigned_agent_id)
    : "";
  const isAssignedAgent =
    (Boolean(assignedAgentId) && userId === assignedAgentId) ||
    (!assignedAgentId && isAgentUser(user));
  const isSubmitter = Boolean(userId && submittedBy && userId === submittedBy);
  const isDraftLike = status === "draft" || status === "in-progress";
  const isRejectedEditable = status === "rejected" && (isSubmitter || isAssignedAgent);
  const isAgentEditable =
    (status === "agent-assigned" ||
      workflowStage === "agent-assigned" ||
      workflowStage === "with-agent" ||
      workflowStage === "returned-to-agent") &&
    isAssignedAgent;

  const clientCanEdit =
    isDraftLike || isRejectedEditable || isAgentEditable;
  const apiCanEdit = resolveApiCanEditSubmission(data);
  const canEdit =
    apiCanEdit === false ? false : apiCanEdit === true ? true : clientCanEdit;

  return {
    canEdit,
    rejectionReason:
      status === "rejected" ? data.review_reason?.trim() || null : null,
  };
}

function withServerGeneratedReferenceNumber(
  propertyDetails: PropertyFormValues,
  data: PropertyDraftSubmissionData | null | undefined,
): PropertyFormValues {
  const referenceNumber = data?.payload.property_details?.reference_number?.trim();

  if (!referenceNumber) {
    return propertyDetails;
  }

  return {
    ...propertyDetails,
    property_details: {
      bedrooms: null,
      bathrooms: null,
      built_up_area: "",
      built_up_area_unit: "SQM",
      parking_spaces: null,
      property_age: null,
      furnishing_status: null,
      floor_level: null,
      year_built: null,
      completion_status: null,
      total_floor: "",
      occupancy: null,
      ownership_type: null,
      orientation: null,
      guard_name: "",
      guard_country_code: "+962",
      guard_phone_number: "",
      ...propertyDetails.property_details,
      reference_number: referenceNumber,
    },
  };
}

export function usePropertyCreateScreen() {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const tForm = useTranslations("propertyList.propertyCreate.form");
  const tOwnerInfo = useTranslations("propertyList.propertyCreate.ownerInfo");
  const tAdvanced = useTranslations("propertyList.advanced");
  const tCommon = useTranslations("common");
  const toast = useToast();

  // 3. Global state
  const user = useAuthStore((state) => state.user);
  const isOwner = isOwnerUser(user);
  const showAgencyField = shouldShowPropertyCreateAgencyField(user);

  // 4. Local state
  const [propertyTaxonomy, setPropertyTaxonomy] =
    useState<PropertyTaxonomyResponse | null>(null);
  const [locationTaxonomy, setLocationTaxonomy] =
    useState<LocationTaxonomyResponse | null>(null);
  const [featureCatalogItems, setFeatureCatalogItems] = useState<FeatureCatalogItem[]>(
    [],
  );
  const [activeStep, setActiveStep] = useState(INITIAL_PROPERTY_FORM_ACTIVE_STEP);
  const [maxReachedStep, setMaxReachedStep] = useState(INITIAL_PROPERTY_FORM_ACTIVE_STEP);
  const [propertyDetails, setPropertyDetails] = useState<PropertyFormValues>(
    INITIAL_PROPERTY_FORM_VALUES,
  );
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canEditSubmission, setCanEditSubmission] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(() =>
    searchParams.get(PROPERTY_CREATE_SUBMISSION_ID_PARAM),
  );
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(() =>
    normalizePropertyCreateAgencyId(searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM)),
  );
  // Owner `?agency_id=` (legacy continue URL) hydrates routing + agency (toggle stays off on a fresh create).
  const [routeThroughAgency, setRouteThroughAgency] = useState(
    () =>
      normalizePropertyCreateAgencyId(
        searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM),
      ) != null,
  );
  const [agencyFieldError, setAgencyFieldError] = useState<string | null>(null);
  const [formOptionsCatalog, setFormOptionsCatalog] =
    useState<PropertyFormOptionsCatalog>(EMPTY_PROPERTY_FORM_OPTIONS_CATALOG);
  const [fieldErrors, setFieldErrors] = useState<
    NonNullable<PropertyFormExternalErrors["fieldErrors"]>
  >({});
  const [stepErrors, setStepErrors] = useState<
    NonNullable<PropertyFormExternalErrors["stepErrors"]>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ownerDuplicateError, setOwnerDuplicateError] = useState<string | null>(
    null,
  );
  const propertyFormRef = useRef<PropertyFormHandle | null>(null);
  // Set only after a successful fetch or first draft save — not from URL on mount,
  // otherwise resume-from-draft-list skips hydration.
  const draftHydratedForRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);
  const hasAppliedDefaultOwnerRef = useRef(false);
  const hasEstablishedBaselineRef = useRef(false);
  const commitSavedSnapshotRef = useRef<(propertyDetails: PropertyFormValues) => void>(
    () => {},
  );
  const onDraftRef = useRef<(propertyDetails: PropertyFormValues) => Promise<boolean>>(
    async () => false,
  );
  const propertyFormObserverRef = useRef<MutationObserver | null>(null);
  const propertyFormContainerElRef = useRef<HTMLDivElement | null>(null);
  const propertyDetailsRef = useRef(propertyDetails);
  propertyDetailsRef.current = propertyDetails;
  const submissionIdRef = useRef(submissionId);
  submissionIdRef.current = submissionId;
  const ensureSubmissionIdRef = useRef<() => Promise<string | null>>(async () => null);

  // 5. Data fetching / queries
  const { mutateAsync: fetchPropertyTaxonomy } = useGetPropertyTaxonomy();
  const { mutateAsync: fetchLocationTaxonomy } = useGetLocationTaxonomy();
  const { mutateAsync: fetchFeatureCatalog } = useGetPropertyFeatureCatalog();
  const { mutateAsync: fetchPropertyFormOptions } = useGetPropertyFormOptions();
  const { mutateAsync: fetchPropertyDraftSubmission } = useGetPropertyDraftSubmission();
  const { mutateAsync: saveDraftSubmission, isPending: isCreateDraftSaving } =
    useSavePropertyDraftSubmission();
  const { mutateAsync: updateDraftSubmission, isPending: isUpdateDraftSaving } =
    useUpdatePropertyDraftSubmission();
  const { mutateAsync: submitDraftSubmission } = useSubmitPropertyDraftSubmission();
  const { mutateAsync: submitPropertySubmissionDirect } = useSubmitPropertySubmission();
  const isDraftSaving = isCreateDraftSaving || isUpdateDraftSaving;
  const { onUploadOwnerDocument } = useOwnerDocumentUpload();
  const { onUploadPropertyMedia, onUploadPropertyDocument } = usePropertyMediaUpload(
    submissionId,
    { ensureSubmissionIdRef },
  );
  const { onSearchOwners } = usePropertyOwnerSearch();
  const {
    data: agencyListData,
    isPending: isAgencyListPending,
    isError: isAgencyListError,
    refetch: refetchAgencyList,
  } = useQuery({
    queryKey: ["agency", "property-create-list"],
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
    enabled: showAgencyField && routeThroughAgency,
  });

  const resolvedAgencyIdForQuery = (
    showAgencyField && routeThroughAgency
      ? selectedAgencyId ?? searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM) ?? ""
      : user?.agency?.agency_id ?? ""
  ).trim();

  const { data: agencyResponse } = useQuery({
    queryKey: ["agency", resolvedAgencyIdForQuery],
    queryFn: () => getAgencyById(resolvedAgencyIdForQuery),
    enabled: resolvedAgencyIdForQuery.length > 0,
  });

  const locationDls = usePropertyLocationDls({
    selection: extractPropertyFormDls(propertyDetails),
    onChange: (dls: PropertyLocationDlsSelection) => {
      setFieldErrors((previous) => omitHostLocationFieldErrors(previous));
      setSubmitError(null);
      setPropertyDetails((previous) =>
        withPropertyFormHostLocationFields(previous, {
          showLocation: getPropertyFormShowLocation(previous),
          dls,
        }),
      );
    },
    disabled: !canEditSubmission || isDraftSaving || isSubmitting,
    labels: buildPropertyLocationDlsLabels(t),
  });

  // 6. Derived / memoized values
  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const listingsPath = resolveListingsMenuPath(user) ?? "/my-listings";
    const listingsLabelKey =
      listingsPath === "/manage-listings" ? "manageListings" : "myListings";

    return [
      {
        id: "home",
        href: "/dashboard",
        icon: Home,
        ariaLabel: tCommon("protectedTabHome"),
      },
      {
        id: "listings",
        href: listingsPath,
        icon: List,
        label: tCommon(listingsLabelKey),
      },
      {
        id: "create",
        label: t("breadcrumbCreate"),
        isCurrent: true,
      },
    ];
  }, [t, tCommon, user]);

  const propertyCategories = useMemo(
    () => getPropertyCategories(propertyTaxonomy ?? undefined),
    [propertyTaxonomy],
  );

  const locationCities = useMemo(
    () => getLocationCities(locationTaxonomy ?? undefined),
    [locationTaxonomy],
  );

  const categoryTaxonomy = useMemo(
    () => mapPropertyCategoriesForPropertyForm(propertyCategories),
    [propertyCategories],
  );

  const locationTaxonomyForForm = useMemo(
    () =>
      mapLocationTaxonomyForPropertyForm(
        locationCities,
        getLocationTaxonomyTotal(locationTaxonomy),
      ),
    [locationCities, locationTaxonomy],
  );

  const featuresAndAmenities = useMemo(
    () => mapFeatureCatalogForPropertyForm(featureCatalogItems),
    [featureCatalogItems],
  );

  const minStepIndex = INITIAL_PROPERTY_FORM_ACTIVE_STEP;
  const maxStepIndex = propertyFormSteps.length;
  const hasReferenceNumber = Boolean(
    propertyDetails.property_details?.reference_number?.trim(),
  );
  const hasReferenceNumberRef = useRef(hasReferenceNumber);
  hasReferenceNumberRef.current = hasReferenceNumber;
  const showLocation = getPropertyFormShowLocation(propertyDetails);
  const dlsSelection = useMemo(
    () => extractPropertyFormDls(propertyDetails),
    [propertyDetails],
  );
  const dlsSelectionRef = useRef(dlsSelection);
  dlsSelectionRef.current = dlsSelection;

  const resolvedAgencyId = resolvedAgencyIdForQuery;

  const pricingCurrency = useMemo(
    (): AgencyCurrency =>
      normalizeAgencyCurrency(agencyResponse?.data?.currency ?? DEFAULT_AGENCY_CURRENCY),
    [agencyResponse?.data?.currency],
  );

  const measurementUnit = "SQM" as const;

  const isAgencyListLoading =
    showAgencyField && routeThroughAgency && isAgencyListPending;

  const agencyOptions = useMemo((): SelectOption[] => {
    const options = (agencyListData?.items ?? []).map((agency) => ({
      value: agency.id,
      label: agency.agency_name || agency.email,
    }));

    const selectedId = normalizePropertyCreateAgencyId(selectedAgencyId);
    if (selectedId && !options.some((option) => option.value === selectedId)) {
      const fallbackLabel =
        agencyResponse?.data?.agency_name?.trim() || selectedId;
      options.unshift({ value: selectedId, label: fallbackLabel });
    }

    return options;
  }, [
    agencyListData?.items,
    agencyResponse?.data?.agency_name,
    selectedAgencyId,
  ]);

  const agencyFieldHint = useMemo(() => {
    if (!showAgencyField || agencyFieldError) {
      return undefined;
    }

    if (isAgencyListLoading) {
      return t("agency.loading");
    }

    if (isAgencyListError) {
      return undefined;
    }

    if (agencyOptions.length === 0) {
      return t("agency.empty");
    }

    return undefined;
  }, [
    agencyFieldError,
    agencyOptions.length,
    isAgencyListError,
    isAgencyListLoading,
    showAgencyField,
    t,
  ]);

  const agencyFieldDisplayError = agencyFieldError
    ?? (showAgencyField && isAgencyListError ? t("agency.loadError") : null);

  const ownerInfoValidationMessages = useMemo(
    () => buildPropertyCreateOwnerInfoValidationMessages(tOwnerInfo),
    [tOwnerInfo],
  );

  const ownerInfoConfig = useMemo((): OwnerInfoConfig => {
    const readOnlyOwnerIndices = isOwnerUser(user)
      ? resolveReadOnlyOwnerIndicesForLoggedInOwner(
          propertyDetails.owner_info?.owners,
          user?.email,
          !submissionId,
        )
      : [];

    return buildPropertyCreateOwnerInfoConfig({
      requireDocuments: true,
      validationMessages: ownerInfoValidationMessages,
      readOnlyOwnerIndices,
      nationalityOptions: formOptionsCatalog.nationalityOptions,
    });
  }, [
    formOptionsCatalog.nationalityOptions,
    ownerInfoValidationMessages,
    propertyDetails.owner_info?.owners,
    submissionId,
    user,
  ]);

  const formConfig = useMemo(
    () =>
      buildPropertyFormConfig(
        tForm as Parameters<typeof buildPropertyFormConfig>[0],
        formOptionsCatalog,
      ),
    [formOptionsCatalog, tForm],
  );

  const libraryFieldErrors = useMemo(
    () => omitHostLocationFieldErrors(fieldErrors),
    [fieldErrors],
  );

  const locationDlsFields = useMemo(
    () =>
      locationDls.fields.map((field) => ({
        ...field,
        error:
          field.error ?? getHostLocationFieldError(fieldErrors, field.name),
      })),
    [fieldErrors, locationDls.fields],
  );

  const syncSubmissionIdInUrl = useCallback(
    (nextSubmissionId: string) => {
      submissionIdRef.current = nextSubmissionId;
      setSubmissionId(nextSubmissionId);

      const params = new URLSearchParams(searchParams.toString());
      params.set(PROPERTY_CREATE_SUBMISSION_ID_PARAM, nextSubmissionId);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const hydrateDraftSubmission = useCallback(
    async (
      submissionIdToLoad: string,
      catalogItems: FeatureCatalogItem[],
      formOptions: PropertyFormOptionsCatalog,
    ) => {
      if (draftHydratedForRef.current === submissionIdToLoad) {
        return;
      }

      const draftResponse = await fetchPropertyDraftSubmission(submissionIdToLoad);

      if (draftResponse.success && draftResponse.data) {
        const featuresForForm = mapFeatureCatalogForPropertyForm(catalogItems);
        const catalogWithFloor = withEnsuredFloorOption(
          formOptions,
          getDraftFloorValue(draftResponse.data),
        );
        const hydratedDetails = mapPropertyDraftSubmissionToPropertyFormValues(
          draftResponse.data,
          featuresForForm,
          catalogWithFloor,
        );

        setFormOptionsCatalog(catalogWithFloor);
        setPropertyDetails(hydratedDetails);
        setActiveStep(draftResponse.data.current_step);
        setMaxReachedStep(
          Math.max(
            draftResponse.data.current_step,
            draftResponse.data.last_completed_step,
          ),
        );
        setSubmissionId(draftResponse.data.submission_id);
        submissionIdRef.current = draftResponse.data.submission_id;
        setRouteThroughAgency(Boolean(draftResponse.data.route_through_agency));
        setSelectedAgencyId(
          normalizePropertyCreateAgencyId(draftResponse.data.agency_id),
        );
        draftHydratedForRef.current = draftResponse.data.submission_id;

        const formAccess = resolveSubmissionFormAccess(draftResponse.data, user);
        setCanEditSubmission(formAccess.canEdit);
        setRejectionReason(formAccess.rejectionReason);
        return hydratedDetails;
      }

      return null;
    },
    [fetchPropertyDraftSubmission, user],
  );

  // 7. Callbacks
  const propertyFormContainerRef = useCallback((container: HTMLDivElement | null) => {
    propertyFormObserverRef.current?.disconnect();
    propertyFormObserverRef.current = null;
    propertyFormContainerElRef.current = container;

    if (!container) {
      return;
    }

    const applyHostFormPatches = () => {
      applyPropertyCreateFormDomPatches(container, {
        ownerDocumentsLabel: tForm("ownerDocumentsLabel"),
        hasReferenceNumber: hasReferenceNumberRef.current,
      });
    };

    applyHostFormPatches();

    const observer = new MutationObserver(applyHostFormPatches);
    observer.observe(container, { childList: true, subtree: true });
    propertyFormObserverRef.current = observer;
  }, [tForm]);

  const loadCreateCatalog = useCallback(
    async (initialSubmissionId?: string | null) => {
      setIsCatalogLoading(true);

      try {
        const [propertyTaxonomyResponse, locationTaxonomyResponse, featureCatalogResponse] =
          await Promise.all([
            fetchPropertyTaxonomy(),
            fetchLocationTaxonomy(),
            fetchFeatureCatalog(),
          ]);

        const formOptionsResponse = await fetchPropertyFormOptions().catch(
          () => null,
        );

        const formOptionsCatalog = withPropertyFormOptionFallbacks(
          mapPropertyFormOptionsCatalog(formOptionsResponse),
          {
            furnished: tAdvanced("furnitureOptions.furnished"),
            unfurnished: tAdvanced("furnitureOptions.unfurnished"),
            semiFurnished: tAdvanced("furnitureOptions.semiFurnished"),
            ground: tAdvanced("floorOptions.ground"),
            penthouse: tAdvanced("floorOptions.penthouse"),
          },
        );

        setPropertyTaxonomy(propertyTaxonomyResponse);
        setLocationTaxonomy(locationTaxonomyResponse);
        setFormOptionsCatalog(formOptionsCatalog);

        const catalogItems = featureCatalogResponse.data?.items ?? [];
        setFeatureCatalogItems(catalogItems);

        if (initialSubmissionId) {
          await hydrateDraftSubmission(
            initialSubmissionId,
            catalogItems,
            formOptionsCatalog,
          );
        }
      } finally {
        setIsCatalogLoading(false);
      }
    },
    [
      fetchFeatureCatalog,
      fetchLocationTaxonomy,
      fetchPropertyFormOptions,
      fetchPropertyTaxonomy,
      hydrateDraftSubmission,
      tAdvanced,
    ],
  );

  const clearSubmissionErrors = useCallback(() => {
    setSubmitError(null);
    setFieldErrors({});
    setStepErrors({});
    setOwnerDuplicateError(null);
  }, []);

  const onNext = useCallback(
    (nextPropertyDetails: PropertyFormValues) => {
      clearSubmissionErrors();
      setPropertyDetails(
        withPropertyFormHostLocationFields(nextPropertyDetails, {
          showLocation,
          dls: dlsSelectionRef.current,
        }),
      );
      setActiveStep((previous) => {
        const nextStep = Math.min(previous + 1, maxStepIndex);
        setMaxReachedStep((maxPrevious) => Math.max(maxPrevious, nextStep));
        return nextStep;
      });
    },
    [clearSubmissionErrors, maxStepIndex, showLocation],
  );

  const onPrevious = useCallback(() => {
    clearSubmissionErrors();
    setActiveStep((previous) => Math.max(previous - 1, minStepIndex));
  }, [clearSubmissionErrors, minStepIndex]);

  const onAgencyChange = useCallback((value: string) => {
    setSelectedAgencyId(normalizePropertyCreateAgencyId(value));
    setAgencyFieldError(null);
  }, []);

  const onRouteThroughAgencyChange = useCallback((checked: boolean) => {
    setRouteThroughAgency(checked);
    setAgencyFieldError(null);
  }, []);

  const onRetryAgencyList = useCallback(() => {
    void refetchAgencyList();
  }, [refetchAgencyList]);

  const onStepClick = useCallback(
    (step: number, _step: PropertyFormStep, nextPropertyDetails: PropertyFormValues) => {
      clearSubmissionErrors();
      setPropertyDetails(
        withPropertyFormHostLocationFields(nextPropertyDetails, {
          showLocation,
          dls: dlsSelectionRef.current,
        }),
      );
      setActiveStep(step);
      const nextMaxReachedStep = nextPropertyDetails.max_reached_step ?? step;
      setMaxReachedStep((maxPrevious) => Math.max(maxPrevious, nextMaxReachedStep));
    },
    [clearSubmissionErrors, showLocation],
  );

  const onShowLocationChange = useCallback((checked: boolean) => {
    setPropertyDetails((previous) =>
      withPropertyFormShowLocation(previous, checked),
    );
  }, []);

  const applySubmissionError = useCallback(
    (error: unknown, fallbackMessage: string) => {
      const parsed = parsePropertySubmissionError(error, fallbackMessage, {
        unreachable: t("errors.unreachable"),
        timeout: t("errors.timeout"),
        server: t("errors.server"),
      });
      setSubmitError(parsed.message);
      setFieldErrors(parsed.fieldErrors);
      setStepErrors(parsed.stepErrors);
      setOwnerDuplicateError(parsed.ownerDuplicateError);
      toast.error(parsed.message);

      const firstLibraryFieldPath = Object.keys(
        omitHostLocationFieldErrors(parsed.fieldErrors),
      )[0];
      if (firstLibraryFieldPath) {
        propertyFormRef.current?.goToField(firstLibraryFieldPath);
      }
    },
    [t, toast],
  );

  const onRequestStepChange = useCallback(
    (step: number) => {
      setActiveStep(step);
      setMaxReachedStep((maxPrevious) => Math.max(maxPrevious, step));
    },
    [],
  );

  const onSubmit = useCallback(async () => {
    const currentStep = propertyDetails.active_step ?? activeStep;
    const lastCompletedStep = Math.max(
      propertyDetails.max_reached_step ?? maxReachedStep,
      currentStep,
    );
    const detailsForSubmit: PropertyFormValues = {
      ...propertyDetails,
      active_step: currentStep,
      max_reached_step: lastCompletedStep,
    };
    const submitPayloadOptions = {
      forSubmit: true as const,
      currency: toPropertyDraftSubmissionCurrency(pricingCurrency),
    };
    const shouldRouteThroughAgency = showAgencyField && routeThroughAgency;
    const agencyId = shouldRouteThroughAgency
      ? normalizePropertyCreateAgencyId(
          selectedAgencyId ?? searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM),
        )
      : null;
    const listingsPath = resolveListingsMenuPath(user) ?? "/my-listings";

    if (shouldRouteThroughAgency && !agencyId) {
      const requiredMessage = t("agency.required");
      setAgencyFieldError(requiredMessage);
      toast.error(requiredMessage);
      return;
    }

    setIsSubmitting(true);
    clearSubmissionErrors();

    try {
      if (!submissionId) {
        const submitResponse = await submitPropertySubmissionDirect(
          buildPropertySubmissionDirectSubmitRequestBody(
            detailsForSubmit,
            featuresAndAmenities,
            {
              ...submitPayloadOptions,
              routeThroughAgency: shouldRouteThroughAgency,
              agencyId,
            },
          ),
        );

        if (submitResponse.success) {
          toast.success(t("submitSuccess"), {
            description: resolveSubmitSuccessDescription(
              submitResponse.data,
              submitResponse.message,
              {
                isOwner,
                pendingAdmin: t("submitSuccessPendingAdmin"),
                pendingAgency: t("submitSuccessPendingAgency"),
              },
            ),
          });
          commitSavedSnapshotRef.current(detailsForSubmit);
          router.push(listingsPath);
          return;
        }

        applySubmissionError(submitResponse, submitResponse.message ?? t("submitError"));
        return;
      }

      const saveResponse = await updateDraftSubmission({
        submissionId,
        body: buildPropertyDraftSubmissionUpdateRequestBody(
          detailsForSubmit,
          featuresAndAmenities,
          currentStep,
          lastCompletedStep,
          {
            ...submitPayloadOptions,
            routeThroughAgency: shouldRouteThroughAgency,
            agencyId,
          },
        ),
      });

      if (!saveResponse.success) {
        applySubmissionError(saveResponse, saveResponse.message ?? t("submitSaveError"));
        return;
      }

      const submitResponse = await submitDraftSubmission({
        submissionId,
        body: { confirm_submit: true },
      });

      if (submitResponse.success) {
        toast.success(t("submitSuccess"), {
          description: resolveSubmitSuccessDescription(
            submitResponse.data,
            submitResponse.message,
            {
              isOwner,
              pendingAdmin: t("submitSuccessPendingAdmin"),
              pendingAgency: t("submitSuccessPendingAgency"),
            },
          ),
        });
        commitSavedSnapshotRef.current(detailsForSubmit);
        router.push(listingsPath);
        return;
      }

      applySubmissionError(submitResponse, submitResponse.message ?? t("submitError"));
    } catch (error) {
      applySubmissionError(error, t("submitError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeStep,
    applySubmissionError,
    clearSubmissionErrors,
    featuresAndAmenities,
    isOwner,
    maxReachedStep,
    pricingCurrency,
    propertyDetails,
    routeThroughAgency,
    router,
    searchParams,
    selectedAgencyId,
    showAgencyField,
    submissionId,
    submitDraftSubmission,
    submitPropertySubmissionDirect,
    t,
    toast,
    updateDraftSubmission,
    user,
  ]);

  const onDraft = useCallback(
    async (nextPropertyDetails: PropertyFormValues): Promise<boolean> => {
      const detailsWithLocationVisibility = withPropertyFormHostLocationFields(
        nextPropertyDetails,
        {
          showLocation,
          dls: dlsSelectionRef.current,
        },
      );
      setPropertyDetails(detailsWithLocationVisibility);

      const currentStep =
        detailsWithLocationVisibility.active_step ?? activeStep;
      const lastCompletedStep =
        detailsWithLocationVisibility.max_reached_step ??
        maxReachedStep ??
        currentStep;
      const shouldRouteThroughAgency = showAgencyField && routeThroughAgency;
      const agencyId = shouldRouteThroughAgency
        ? normalizePropertyCreateAgencyId(
            selectedAgencyId ?? searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM),
          )
        : null;

      if (shouldRouteThroughAgency && !agencyId) {
        const requiredMessage = t("agency.required");
        setAgencyFieldError(requiredMessage);
        toast.error(requiredMessage);
        return false;
      }

      try {
        clearSubmissionErrors();
        const routingOptions = {
          agencyId,
          routeThroughAgency: shouldRouteThroughAgency,
          currency: toPropertyDraftSubmissionCurrency(pricingCurrency),
        };
        const response = submissionId
          ? await updateDraftSubmission({
              submissionId,
              body: buildPropertyDraftSubmissionUpdateRequestBody(
                detailsWithLocationVisibility,
                featuresAndAmenities,
                currentStep,
                lastCompletedStep,
                routingOptions,
              ),
            })
          : await saveDraftSubmission(
              buildPropertyDraftSubmissionRequestBody(
                detailsWithLocationVisibility,
                featuresAndAmenities,
                currentStep,
                lastCompletedStep,
                routingOptions,
              ),
            );

        if (response.success) {
          const savedPropertyDetails = withServerGeneratedReferenceNumber(
            detailsWithLocationVisibility,
            response.data,
          );
          const nextSubmissionId = response.data?.submission_id;
          setPropertyDetails(savedPropertyDetails);
          if (nextSubmissionId && nextSubmissionId !== submissionId) {
            draftHydratedForRef.current = nextSubmissionId;
            syncSubmissionIdInUrl(nextSubmissionId);
          }
          commitSavedSnapshotRef.current(savedPropertyDetails);

          toast.success(t("draftSaveSuccess"), {
            description: response.message ?? undefined,
          });
          return true;
        }

        applySubmissionError(response, response.message ?? t("draftSaveError"));
        return false;
      } catch (error) {
        applySubmissionError(error, t("draftSaveError"));
        return false;
      }
    },
    [
      activeStep,
      applySubmissionError,
      clearSubmissionErrors,
      featuresAndAmenities,
      maxReachedStep,
      pricingCurrency,
      routeThroughAgency,
      saveDraftSubmission,
      searchParams,
      selectedAgencyId,
      showAgencyField,
      showLocation,
      submissionId,
      syncSubmissionIdInUrl,
      t,
      toast,
      updateDraftSubmission,
    ],
  );

  const {
    dirtyStepIds,
    hasUnsavedChanges,
    commitSavedSnapshot,
    unsavedChangesModal,
  } = usePropertyCreateUnsavedChanges({
    enabled: !isCatalogLoading,
    canEdit: canEditSubmission,
    isDraftSaving,
    onDraft: (propertyDetails) => onDraftRef.current(propertyDetails),
    propertyDetails,
  });

  // 9. Effects
  useEffect(() => {
    onDraftRef.current = onDraft;
    commitSavedSnapshotRef.current = commitSavedSnapshot;
    ensureSubmissionIdRef.current = async () => {
      if (submissionIdRef.current) {
        return submissionIdRef.current;
      }

      const didSave = await onDraftRef.current(propertyDetailsRef.current);
      if (!didSave) {
        return null;
      }

      return submissionIdRef.current;
    };
  }, [commitSavedSnapshot, onDraft]);

  useEffect(() => {
    if (
      hasEstablishedBaselineRef.current ||
      isCatalogLoading ||
      (submissionId != null && draftHydratedForRef.current !== submissionId) ||
      (!submissionId && isOwnerUser(user))
    ) {
      return;
    }

    // Defer one tick so baseline uses library live payload after hydrate/catalog, not mapper-only state.
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled || hasEstablishedBaselineRef.current) {
        return;
      }

      hasEstablishedBaselineRef.current = true;
      commitSavedSnapshot(propertyDetailsRef.current);
    });

    return () => {
      cancelled = true;
    };
  }, [commitSavedSnapshot, isCatalogLoading, propertyDetails, submissionId, user]);

  useEffect(() => {
    if (hasAppliedDefaultOwnerRef.current || !user || !isOwnerUser(user) || submissionId) {
      return;
    }

    hasAppliedDefaultOwnerRef.current = true;
    setPropertyDetails((previous) => {
      const existingOwners = previous.owner_info?.owners ?? [];
      const hasOwnerContent = existingOwners.some(hasOwnerInfoRowContent);

      if (hasOwnerContent) {
        return previous;
      }

      const nextDetails = {
        ...previous,
        owner_info: {
          owners: [buildLoggedInOwnerInfoItem(user)],
        },
      };

      queueMicrotask(() => {
        hasEstablishedBaselineRef.current = true;
        commitSavedSnapshotRef.current(nextDetails);
      });

      return nextDetails;
    });
  }, [submissionId, user]);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    void loadCreateCatalog(
      searchParams.get(PROPERTY_CREATE_SUBMISSION_ID_PARAM),
    );
  }, [loadCreateCatalog, searchParams]);

  useEffect(() => {
    const container = propertyFormContainerElRef.current;
    if (!container) {
      return;
    }

    applyPropertyCreateFormDomPatches(container, {
      ownerDocumentsLabel: tForm("ownerDocumentsLabel"),
      hasReferenceNumber,
    });
  }, [hasReferenceNumber, tForm]);

  // 10. Return values
  return {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    breadcrumbItems,
    breadcrumbAriaLabel: tCommon("breadcrumbAriaLabel"),
    activeStep,
    maxReachedStep,
    categoryTaxonomy,
    locationTaxonomyForForm,
    featuresAndAmenities,
    propertyDetails,
    isCatalogLoading,
    isDraftSaving,
    isSubmitting,
    submissionId,
    canEditSubmission,
    rejectionReason,
    hasUnsavedChanges,
    dirtyStepIds,
    ownerInfoConfig,
    formConfig,
    fieldErrors: libraryFieldErrors,
    stepErrors,
    submitError,
    ownerDuplicateError,
    onSearchOwners,
    onRequestStepChange,
    propertyFormRef,
    pricingCurrency,
    measurementUnit,
    propertyFormContainerRef,
    locationVisibilityField: {
      checked: showLocation,
      disabled: !canEditSubmission || isDraftSaving || isSubmitting,
      title: t("locationVisibility.title"),
      description: t("locationVisibility.description"),
      ariaLabel: t("locationVisibility.ariaLabel"),
      onChange: onShowLocationChange,
    },
    locationDlsField: {
      sectionTitle: locationDls.sectionTitle,
      fields: locationDlsFields,
    },
    unsavedChangesModal,
    agencyField: showAgencyField
      ? {
          sectionTitle: t("agency.routing.title"),
          routingQuestion: isOwner
            ? t("agency.verify.label")
            : t("agency.routing.question"),
          routingAriaLabel: isOwner ? t("agency.verify.ariaLabel") : undefined,
          routingControl: isOwner ? ("switch" as const) : ("checkbox" as const),
          routeThroughAgency,
          onRouteThroughAgencyChange,
          label: t("agency.label"),
          placeholder: t("agency.placeholder"),
          options: agencyOptions,
          value: selectedAgencyId ?? "",
          onChange: onAgencyChange,
          error: agencyFieldDisplayError ?? undefined,
          hint: agencyFieldHint,
          routingDisabled:
            !canEditSubmission || isDraftSaving || isSubmitting,
          disabled:
            !canEditSubmission ||
            isDraftSaving ||
            isSubmitting ||
            isAgencyListLoading ||
            agencyOptions.length === 0,
          isRequired: routeThroughAgency,
          retryLabel: isAgencyListError ? t("agency.retry") : undefined,
          onRetry: isAgencyListError ? onRetryAgencyList : undefined,
        }
      : null,
    onNext,
    onPrevious,
    onStepClick,
    onSubmit,
    onDraft,
    onUploadOwnerDocument,
    onUploadPropertyMedia,
    onUploadPropertyDocument,
    reloadCreateCatalog: () =>
      loadCreateCatalog(searchParams.get(PROPERTY_CREATE_SUBMISSION_ID_PARAM)),
  };
}
