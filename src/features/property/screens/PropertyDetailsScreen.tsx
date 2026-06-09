"use client";

import { PropertyView, SimilarProperties } from "@abdoun/abdoun-library";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { useRouter } from "@/src/i18n/navigation";
import {
  bodyTextClasses,
  headingPageClasses,
} from "@/src/lib/typography";
import { cn } from "@/src/lib/cn";
import { usePropertyDetails } from "../hooks/usePropertyDetails";

type PropertyDetailsScreenProps = {
  propertyId: string;
};

export default function PropertyDetailsScreen({
  propertyId,
}: PropertyDetailsScreenProps) {
  const router = useRouter();
  const {
    isLoading,
    isError,
    propertyDetails,
    isFavouriteLoading,
    locale,
    applicationKey,
    featureCatalog,
    tabs,
    toggleFavourite,
    openAgentEmail,
    similarListings,
    isSimilarLoading,
    upcomingFeatureModal,
  } = usePropertyDetails(propertyId);

  if (!isLoading && (isError || !propertyDetails)) {
    return (
      <article className="rounded-xl border border-secondary/15 bg-surface p-4 sm:p-6">
        <h1 className={headingPageClasses}>Property not found</h1>
        <p className={cn("mt-2 text-muted", bodyTextClasses)}>
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
        isFavouriteLoading={isFavouriteLoading}
        locale={locale}
        showAgent
        showOwner
        features={featureCatalog}
        tabs={tabs}
        onClickFavourite={toggleFavourite}
        onClickAgentEmail={openAgentEmail}
      />

      <SimilarProperties
        title="Similar Properties"
        viewMoreLabel="View More"
        onViewMore={() => {
          const params = new URLSearchParams({
            status:
              propertyDetails?.listing_type === "rent" ? "rent" : "buy",
            category: propertyDetails?.category ?? "residential",
            similar_to: propertyId,
          });

          router.push(`/property-list?${params.toString()}`);
        }}
        data={similarListings}
        isLoading={isSimilarLoading}
        skeletonCount={4}
        applicationKey="abdoun-web"
        canViewBadges
        onClick={(item) => {
          router.push(`/propert-details/${item.id}`);
        }}
        onClickFavourite={toggleFavourite}
      />
    </div>
  );
}
