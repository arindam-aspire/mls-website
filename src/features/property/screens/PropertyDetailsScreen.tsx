"use client";

import { PropertyView, SimilarProperties } from "@abdoun/abdoun-library";
import { CheckCircle2, UserMinus, XCircle } from "lucide-react";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { useRouter } from "@/src/i18n/navigation";
import {
  bodyTextClasses,
  headingPageClasses,
} from "@/src/lib/typography";
import { cn } from "@/src/lib/cn";
import { AssignAgentModal } from "../components/AssignAgentModal";
import { RejectSubmissionModal } from "../components/RejectSubmissionModal";
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
    statusActionCard,
    workflowConfirmModal,
    rejectWorkflowModal,
    assignAgentModal,
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

      {workflowConfirmModal ? (
        <ConfirmModal
          open={workflowConfirmModal.open}
          onClose={workflowConfirmModal.onClose}
          onConfirm={workflowConfirmModal.onConfirm}
          onCancel={workflowConfirmModal.onClose}
          variant={workflowConfirmModal.variant}
          title={workflowConfirmModal.title}
          description={workflowConfirmModal.description}
          confirmLabel={workflowConfirmModal.confirmLabel}
          cancelLabel={workflowConfirmModal.cancelLabel}
          cancelColor="inherit"
          confirmIcon={
            workflowConfirmModal.variant === "danger" ? (
              workflowConfirmModal.confirmLabel.includes("Unassign") ? (
                <UserMinus className="size-4" aria-hidden />
              ) : (
                <XCircle className="size-4" aria-hidden />
              )
            ) : (
              <CheckCircle2 className="size-4" aria-hidden />
            )
          }
          isLoading={workflowConfirmModal.isLoading}
          loadingLabel={workflowConfirmModal.loadingLabel}
        />
      ) : null}

      {assignAgentModal ? (
        <AssignAgentModal
          open={assignAgentModal.open}
          listingTitle={assignAgentModal.listingTitle}
          mode={assignAgentModal.mode}
          isAssigning={assignAgentModal.isAssigning}
          onClose={assignAgentModal.onClose}
          onAssign={assignAgentModal.onAssign}
        />
      ) : null}

      {rejectWorkflowModal ? (
        <RejectSubmissionModal
          open={rejectWorkflowModal.open}
          listingTitle={rejectWorkflowModal.listingTitle}
          isSubmitting={rejectWorkflowModal.isSubmitting}
          title={rejectWorkflowModal.title}
          description={rejectWorkflowModal.description}
          reasonLabel={rejectWorkflowModal.reasonLabel}
          reasonPlaceholder={rejectWorkflowModal.reasonPlaceholder}
          submitLabel={rejectWorkflowModal.submitLabel}
          submittingLabel={rejectWorkflowModal.submittingLabel}
          onClose={rejectWorkflowModal.onClose}
          onSubmit={rejectWorkflowModal.onSubmit}
        />
      ) : null}

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
        statusActionCard={statusActionCard}
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
