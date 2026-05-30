"use client";

import { PropertyView } from "@abdoun/abdoun-library";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { usePropertyDetails } from "../hooks/usePropertyDetails";

type PropertyDetailsScreenProps = {
  propertyId: string;
};

export default function PropertyDetailsScreen({
  propertyId,
}: PropertyDetailsScreenProps) {
  const {
    isLoading,
    isError,
    propertyDetails,
    locale,
    applicationKey,
    featureCatalog,
    tabs,
    toggleFavourite,
    openAgentEmail,
    upcomingFeatureModal,
  } = usePropertyDetails(propertyId);

  if (!isLoading && (isError || !propertyDetails)) {
    return (
      <article className="rounded-xl border border-secondary/15 bg-surface p-4 sm:p-6">
        <h1 className="text-lg font-semibold text-text sm:text-xl">
          Property not found
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          We could not load this property. It may have been removed or is
          temporarily unavailable.
        </p>
      </article>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <UpcomingFeatureModal
        open={upcomingFeatureModal.open}
        onClose={upcomingFeatureModal.onClose}
      />
      <PropertyView
        isLoading={isLoading}
        applicationKey={applicationKey}
        propertyDetails={propertyDetails}
        locale={locale}
        showAgent
        showOwner
        features={featureCatalog}
        tabs={tabs}
        onClickFavourite={toggleFavourite}
        onClickAgentEmail={openAgentEmail}
      />
    </div>
  );
}
