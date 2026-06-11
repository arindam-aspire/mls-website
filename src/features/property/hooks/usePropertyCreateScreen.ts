"use client";

import type { BreadcrumbItem } from "@/src/components/ui/breadcrumb";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { resolveListingsMenuPath } from "@/src/features/auth/utils/profileMenuRoleAccess";
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
import { PROPERTY_CREATE_SUBMISSION_ID_PARAM } from "@/src/features/property/constants/propertyCreate.constants";
import {
  INITIAL_PROPERTY_FORM_ACTIVE_STEP,
  INITIAL_PROPERTY_FORM_VALUES,
} from "@/src/features/property/constants/propertyForm.constants";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  buildPropertyDraftSubmissionRequestBody,
  buildPropertyDraftSubmissionUpdateRequestBody,
} from "@/src/features/property/mappers/propertyDraftSubmission.mapper";
import {
  mapFeatureCatalogForPropertyForm,
  mapLocationTaxonomyForPropertyForm,
  mapPropertyCategoriesForPropertyForm,
} from "@/src/features/property/mappers/propertyForm.mapper";
import {
  useGetPropertyFeatureCatalog,
  useSavePropertyDraftSubmission,
  useUpdatePropertyDraftSubmission,
} from "@/src/features/property/mutations/property.mutation";
import type { FeatureCatalogItem } from "@/src/features/property/types/property.types";
import {
  propertyFormSteps,
  type PropertyFormStep,
  type PropertyFormValues,
} from "@abdoun/abdoun-library";
import { useToast } from "@/src/hooks/useToast";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function getLocationTaxonomyTotal(
  taxonomy: LocationTaxonomyResponse | null,
): number | undefined {
  const payload = taxonomy?.data;

  if (payload == null || Array.isArray(payload)) {
    return undefined;
  }

  return payload.total;
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
  const submissionIdFromUrl = searchParams.get(PROPERTY_CREATE_SUBMISSION_ID_PARAM);
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
  const [submissionId, setSubmissionId] = useState<string | null>(submissionIdFromUrl);

  // 5. Data fetching / queries
  const { mutateAsync: fetchPropertyTaxonomy } = useGetPropertyTaxonomy();
  const { mutateAsync: fetchLocationTaxonomy } = useGetLocationTaxonomy();
  const { mutateAsync: fetchFeatureCatalog } = useGetPropertyFeatureCatalog();
  const { mutateAsync: saveDraftSubmission, isPending: isCreateDraftSaving } =
    useSavePropertyDraftSubmission();
  const { mutateAsync: updateDraftSubmission, isPending: isUpdateDraftSaving } =
    useUpdatePropertyDraftSubmission();
  const isDraftSaving = isCreateDraftSaving || isUpdateDraftSaving;

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

  // 7. Callbacks
  const loadCreateCatalog = useCallback(async () => {
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
      setFeatureCatalogItems(featureCatalogResponse.data?.items ?? []);
    } finally {
      setIsCatalogLoading(false);
    }
  }, [fetchFeatureCatalog, fetchLocationTaxonomy, fetchPropertyTaxonomy]);

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

  const onSubmit = useCallback(() => {
    // TODO: connect create-property submit API when available.
  }, []);

  const onDraft = useCallback(
    async (nextPropertyDetails: PropertyFormValues) => {
      setPropertyDetails(nextPropertyDetails);

      const currentStep = nextPropertyDetails.active_step ?? activeStep;

      try {
        const response = submissionId
          ? await updateDraftSubmission({
              submissionId,
              body: buildPropertyDraftSubmissionUpdateRequestBody(
                nextPropertyDetails,
                featuresAndAmenities,
                currentStep,
              ),
            })
          : await saveDraftSubmission(
              buildPropertyDraftSubmissionRequestBody(
                nextPropertyDetails,
                featuresAndAmenities,
                currentStep,
              ),
            );

        if (response.success) {
          const nextSubmissionId = response.data?.submission_id;
          if (nextSubmissionId && nextSubmissionId !== submissionId) {
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
      saveDraftSubmission,
      submissionId,
      syncSubmissionIdInUrl,
      t,
      toast,
      updateDraftSubmission,
    ],
  );

  const onUploadOwnerDocument = useCallback(async (_file: File) => null, []);

  const onUploadPropertyMedia = useCallback(async (_file: File) => null, []);

  const onUploadPropertyDocument = useCallback(async (_file: File) => null, []);

  // 9. Effects
  useEffect(() => {
    if (submissionIdFromUrl) {
      setSubmissionId(submissionIdFromUrl);
    }
  }, [submissionIdFromUrl]);

  useEffect(() => {
    void loadCreateCatalog();
  }, [loadCreateCatalog]);

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
    submissionId,
    onNext,
    onPrevious,
    onStepClick,
    onSubmit,
    onDraft,
    onUploadOwnerDocument,
    onUploadPropertyMedia,
    onUploadPropertyDocument,
    reloadCreateCatalog: loadCreateCatalog,
  };
}
