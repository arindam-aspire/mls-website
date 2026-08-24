"use client";

import { Breadcrumb } from "@/src/components/ui/breadcrumb";
import { PropertyCreateAgencyField } from "@/src/features/property/components/PropertyCreateAgencyField";
import { PropertyCreateUnsavedChangesModal } from "@/src/features/property/components/PropertyCreateUnsavedChangesModal";
import { PropertyCreateScreenSkeleton } from "@/src/features/property/components/PropertyCreateScreenSkeleton";
import { usePropertyCreateScreen } from "@/src/features/property/hooks/usePropertyCreateScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { PropertyForm } from "@abdoun/abdoun-library";

export default function PropertyCreateScreen() {
  const {
    pageTitle,
    pageSubtitle,
    breadcrumbItems,
    breadcrumbAriaLabel,
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
    ownerInfoConfig,
    pricingCurrency,
    measurementUnit,
    unsavedChangesModal,
    agencyField,
  } = usePropertyCreateScreen();

  if (isCatalogLoading) {
    return <PropertyCreateScreenSkeleton showAgencyField={agencyField != null} />;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className={headingPageClasses}>{pageTitle}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
        </div>

        <Breadcrumb
          items={breadcrumbItems}
          ariaLabel={breadcrumbAriaLabel}
          className="hidden shrink-0 md:flex"
        />
      </div>

      {agencyField ? <PropertyCreateAgencyField {...agencyField} /> : null}

      <PropertyForm
        activeStep={activeStep}
        stickyTopOffset="5.1rem"
        maxReachedStep={maxReachedStep}
        categoryTaxonomy={categoryTaxonomy}
        locationTaxonomy={locationTaxonomyForForm}
        featuresAndAmenities={featuresAndAmenities}
        propertyDetails={propertyDetails}
        draftId={submissionId ?? undefined}
        title={pageTitle}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
        onDraft={onDraft}
        isDraftLoading={isDraftSaving}
        isSubmitting={isSubmitting}
        onStepClick={onStepClick}
        onUploadOwnerDocument={onUploadOwnerDocument}
        onUploadPropertyMedia={onUploadPropertyMedia}
        onUploadPropertyDocument={onUploadPropertyDocument}
        canEdit={canEditSubmission}
        rejectionReason={rejectionReason}
        ownerInfoConfig={ownerInfoConfig}
        pricingCurrency={pricingCurrency}
        measurementUnit={measurementUnit}
      />

      <PropertyCreateUnsavedChangesModal {...unsavedChangesModal} />
    </div>
  );
}
