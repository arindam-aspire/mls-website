"use client";

import type { BreadcrumbItem } from "@/src/components/ui/breadcrumb";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isOwnerUser, resolveListingsMenuPath } from "@/src/features/auth/utils/profileMenuRoleAccess";
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
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  buildPropertyDraftSubmissionRequestBody,
  buildPropertyDraftSubmissionUpdateRequestBody,
  buildPropertySubmissionDirectSubmitRequestBody,
  mapPropertyDraftSubmissionToPropertyFormValues,
} from "@/src/features/property/mappers/propertyDraftSubmission.mapper";
import {
  mapFeatureCatalogForPropertyForm,
  mapLocationTaxonomyForPropertyForm,
  mapPropertyCategoriesForPropertyForm,
} from "@/src/features/property/mappers/propertyForm.mapper";
import { useOwnerDocumentUpload } from "@/src/features/property/hooks/useOwnerDocumentUpload";
import { usePropertyMediaUpload } from "@/src/features/property/hooks/usePropertyMediaUpload";
import {
  useGetPropertyDraftSubmission,
  useGetPropertyFeatureCatalog,
  useSavePropertyDraftSubmission,
  useSubmitPropertyDraftSubmission,
  useSubmitPropertySubmission,
  useUpdatePropertyDraftSubmission,
} from "@/src/features/property/mutations/property.mutation";
import type { FeatureCatalogItem } from "@/src/features/property/types/property.types";
import type { PropertyDraftSubmissionData } from "@/src/features/property/types/propertyDraftSubmission.types";
import {
  propertyFormSteps,
  type PropertyFormStep,
  type PropertyFormValues,
} from "@abdoun/abdoun-library";
import { useToast } from "@/src/hooks/useToast";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function getLocationTaxonomyTotal(
  taxonomy: LocationTaxonomyResponse | null,
): number | undefined {
  const payload = taxonomy?.data;

  if (payload == null || Array.isArray(payload)) {
    return undefined;
  }

  return payload.total;
}

function resolveSubmissionFormAccess(data: PropertyDraftSubmissionData) {
  const status = data.status?.trim().toLowerCase();

  return {
    canEdit: status !== "submitted",
    rejectionReason:
      status === "rejected" ? data.review_reason?.trim() || null : null,
  };
}

export function usePropertyCreateScreen() {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const tCommon = useTranslations("common");
  const toast = useToast();

  // 3. Global state
  const user = useAuthStore((state) => state.user);

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
    searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM),
  );
  // Set only after a successful fetch or first draft save — not from URL on mount,
  // otherwise resume-from-draft-list skips hydration.
  const draftHydratedForRef = useRef<string | null>(null);
  const hasInitializedRef = useRef(false);

  // 5. Data fetching / queries
  const { mutateAsync: fetchPropertyTaxonomy } = useGetPropertyTaxonomy();
  const { mutateAsync: fetchLocationTaxonomy } = useGetLocationTaxonomy();
  const { mutateAsync: fetchFeatureCatalog } = useGetPropertyFeatureCatalog();
  const { mutateAsync: fetchPropertyDraftSubmission } = useGetPropertyDraftSubmission();
  const { mutateAsync: saveDraftSubmission, isPending: isCreateDraftSaving } =
    useSavePropertyDraftSubmission();
  const { mutateAsync: updateDraftSubmission, isPending: isUpdateDraftSaving } =
    useUpdatePropertyDraftSubmission();
  const { mutateAsync: submitDraftSubmission } = useSubmitPropertyDraftSubmission();
  const { mutateAsync: submitPropertySubmissionDirect } = useSubmitPropertySubmission();
  const isDraftSaving = isCreateDraftSaving || isUpdateDraftSaving;
  const { onUploadOwnerDocument } = useOwnerDocumentUpload();
  const { onUploadPropertyMedia, onUploadPropertyDocument } =
    usePropertyMediaUpload(submissionId);

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

  const syncSubmissionIdInUrl = useCallback(
    (nextSubmissionId: string) => {
      setSubmissionId(nextSubmissionId);

      const params = new URLSearchParams(searchParams.toString());
      params.set(PROPERTY_CREATE_SUBMISSION_ID_PARAM, nextSubmissionId);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const hydrateDraftSubmission = useCallback(
    async (submissionIdToLoad: string, catalogItems: FeatureCatalogItem[]) => {
      if (draftHydratedForRef.current === submissionIdToLoad) {
        return;
      }

      const draftResponse = await fetchPropertyDraftSubmission(submissionIdToLoad);

      if (draftResponse.success && draftResponse.data) {
        const featuresForForm = mapFeatureCatalogForPropertyForm(catalogItems);
        const hydratedDetails = mapPropertyDraftSubmissionToPropertyFormValues(
          draftResponse.data,
          featuresForForm,
        );

        setPropertyDetails(hydratedDetails);
        setActiveStep(draftResponse.data.current_step);
        setMaxReachedStep(
          Math.max(
            draftResponse.data.current_step,
            draftResponse.data.last_completed_step,
          ),
        );
        setSubmissionId(draftResponse.data.submission_id);
        if (draftResponse.data.agency_id) {
          setSelectedAgencyId(draftResponse.data.agency_id);
        }
        draftHydratedForRef.current = draftResponse.data.submission_id;

        const formAccess = resolveSubmissionFormAccess(draftResponse.data);
        setCanEditSubmission(formAccess.canEdit);
        setRejectionReason(formAccess.rejectionReason);
      }
    },
    [fetchPropertyDraftSubmission],
  );

  // 7. Callbacks
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

        setPropertyTaxonomy(propertyTaxonomyResponse);
        setLocationTaxonomy(locationTaxonomyResponse);

        const catalogItems = featureCatalogResponse.data?.items ?? [];
        setFeatureCatalogItems(catalogItems);

        if (initialSubmissionId) {
          await hydrateDraftSubmission(initialSubmissionId, catalogItems);
        }
      } finally {
        setIsCatalogLoading(false);
      }
    },
    [
      fetchFeatureCatalog,
      fetchLocationTaxonomy,
      fetchPropertyTaxonomy,
      hydrateDraftSubmission,
    ],
  );

  const onNext = useCallback(
    (nextPropertyDetails: PropertyFormValues) => {
      setPropertyDetails(nextPropertyDetails);
      setActiveStep((previous) => {
        const nextStep = Math.min(previous + 1, maxStepIndex);
        setMaxReachedStep((maxPrevious) => Math.max(maxPrevious, nextStep));
        return nextStep;
      });
    },
    [maxStepIndex],
  );

  const onPrevious = useCallback(() => {
    setActiveStep((previous) => Math.max(previous - 1, minStepIndex));
  }, [minStepIndex]);

  const onStepClick = useCallback(
    (step: number, _step: PropertyFormStep, nextPropertyDetails: PropertyFormValues) => {
      setPropertyDetails(nextPropertyDetails);
      setActiveStep(step);
      const nextMaxReachedStep = nextPropertyDetails.max_reached_step ?? step;
      setMaxReachedStep((maxPrevious) => Math.max(maxPrevious, nextMaxReachedStep));
    },
    [],
  );

  const onSubmit = useCallback(async () => {
    const currentStep = activeStep;
    const lastCompletedStep = Math.max(maxReachedStep, currentStep);
    const detailsForSubmit: PropertyFormValues = {
      ...propertyDetails,
      active_step: currentStep,
      max_reached_step: lastCompletedStep,
    };
    const submitPayloadOptions = { forSubmit: true } as const;
    const agencyId = selectedAgencyId ?? searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM);
    const listingsPath = resolveListingsMenuPath(user) ?? "/my-listings";

    if (isOwnerUser(user) && !agencyId) {
      toast.error("Select an agency before submitting this property.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!submissionId) {
        const submitResponse = await submitPropertySubmissionDirect(
          buildPropertySubmissionDirectSubmitRequestBody(
            detailsForSubmit,
            featuresAndAmenities,
            { ...submitPayloadOptions, agencyId },
          ),
        );

        if (submitResponse.success) {
          toast.success(t("submitSuccess"), {
            description: submitResponse.message ?? undefined,
          });
          router.push(listingsPath);
          return;
        }

        toast.error(t("submitError"), {
          description: submitResponse.message ?? undefined,
        });
        return;
      }

      const saveResponse = await updateDraftSubmission({
        submissionId,
        body: buildPropertyDraftSubmissionUpdateRequestBody(
          detailsForSubmit,
          featuresAndAmenities,
          currentStep,
          lastCompletedStep,
          { ...submitPayloadOptions, agencyId },
        ),
      });

      if (!saveResponse.success) {
        toast.error(t("submitSaveError"), {
          description: saveResponse.message ?? undefined,
        });
        return;
      }

      const submitResponse = await submitDraftSubmission({
        submissionId,
        body: { confirm_submit: true },
      });

      if (submitResponse.success) {
        toast.success(t("submitSuccess"), {
          description: submitResponse.message ?? undefined,
        });
        router.push(listingsPath);
        return;
      }

      toast.error(t("submitError"), {
        description: submitResponse.message ?? undefined,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      toast.error(t("submitError"), { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    activeStep,
    featuresAndAmenities,
    maxReachedStep,
    propertyDetails,
    router,
    searchParams,
    selectedAgencyId,
    submissionId,
    submitDraftSubmission,
    submitPropertySubmissionDirect,
    t,
    toast,
    updateDraftSubmission,
    user,
  ]);

  const onDraft = useCallback(
    async (nextPropertyDetails: PropertyFormValues) => {
      setPropertyDetails(nextPropertyDetails);

      const currentStep = nextPropertyDetails.active_step ?? activeStep;
      const lastCompletedStep =
        nextPropertyDetails.max_reached_step ?? maxReachedStep ?? currentStep;

      try {
        const agencyId = selectedAgencyId ?? searchParams.get(PROPERTY_CREATE_AGENCY_ID_PARAM);
        const response = submissionId
          ? await updateDraftSubmission({
              submissionId,
              body: buildPropertyDraftSubmissionUpdateRequestBody(
                nextPropertyDetails,
                featuresAndAmenities,
                currentStep,
                lastCompletedStep,
                { agencyId },
              ),
            })
          : await saveDraftSubmission(
              buildPropertyDraftSubmissionRequestBody(
                nextPropertyDetails,
                featuresAndAmenities,
                currentStep,
                lastCompletedStep,
                { agencyId },
              ),
            );

        if (response.success) {
          const nextSubmissionId = response.data?.submission_id;
          if (nextSubmissionId && nextSubmissionId !== submissionId) {
            draftHydratedForRef.current = nextSubmissionId;
            syncSubmissionIdInUrl(nextSubmissionId);
          }

          toast.success(t("draftSaveSuccess"), {
            description: response.message ?? undefined,
          });
          return;
        }

        toast.error(t("draftSaveError"), {
          description: response.message ?? undefined,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toast.error(t("draftSaveError"), { description: message });
      }
    },
    [
      activeStep,
      featuresAndAmenities,
      maxReachedStep,
      saveDraftSubmission,
      searchParams,
      selectedAgencyId,
      submissionId,
      syncSubmissionIdInUrl,
      t,
      toast,
      updateDraftSubmission,
    ],
  );

  // 9. Effects
  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    void loadCreateCatalog(
      searchParams.get(PROPERTY_CREATE_SUBMISSION_ID_PARAM),
    );
  }, [loadCreateCatalog, searchParams]);

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
