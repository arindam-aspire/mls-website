"use client";

import { PropertyView, SimilarProperties } from "@abdoun/abdoun-library";
import {
  CheckCircle2,
  ListChecks,
  UserMinus,
  XCircle,
} from "lucide-react";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { ContactModal } from "@/src/features/contact/components/ContactModal";
import { Button } from "@/src/components/ui/button";
import type { ButtonColor, ButtonVariant } from "@/src/components/ui/button/types";
import { Card } from "@/src/components/ui/card";
import { useRouter } from "@/src/i18n/navigation";
import {
  bodySmallTextClasses,
  bodyTextClasses,
  headingPageClasses,
  overlineLabelClasses,
} from "@/src/lib/typography";
import { cn } from "@/src/lib/cn";
import { AssignAgentModal } from "../components/AssignAgentModal";
import { RejectSubmissionModal } from "../components/RejectSubmissionModal";
import { usePropertyDetails } from "../hooks/usePropertyDetails";
import type { PropertyDetailsStatusActionCard } from "../types/property.types";

type PropertyDetailsScreenProps = {
  propertyId: string;
};

type GuardDetailsCardProps = {
  name: string;
  number: string;
  title: string;
  nameLabel: string;
  numberLabel: string;
};

function GuardDetailsCard({
  name,
  number,
  title,
  nameLabel,
  numberLabel,
}: GuardDetailsCardProps) {
  return (
    <Card
      className="flex w-full min-w-0 flex-col gap-4 p-4 sm:p-5 md:p-6"
      aria-label={title}
    >
      <h2 className={cn("text-muted", overlineLabelClasses)}>{title}</h2>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: nameLabel, value: name },
          { label: numberLabel, value: number },
        ].map(({ label, value }) => (
          <div
            key={label}
            className={cn(
              "min-w-0 rounded-lg bg-page p-3 text-text/85",
              bodySmallTextClasses,
            )}
          >
            <dt className="font-medium text-secondary/90">{label}</dt>
            <dd className="break-words text-text/65">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function getActionButtonColor(
  tone: NonNullable<PropertyDetailsStatusActionCard["actions"]>[number]["tone"],
): ButtonColor {
  if (tone === "danger") {
    return "danger";
  }

  if (tone === "success") {
    return "success";
  }

  if (tone === "primary") {
    return "primary";
  }

  return "secondary";
}

function getActionButtonVariant(
  tone: NonNullable<PropertyDetailsStatusActionCard["actions"]>[number]["tone"],
): ButtonVariant {
  return tone === "default" || !tone ? "outline" : "solid";
}

function PropertyStatusActionPanel({
  statusActionCard,
}: {
  statusActionCard?: PropertyDetailsStatusActionCard;
}) {
  const statusLabel =
    statusActionCard?.statusLabel ?? statusActionCard?.status_label ?? "";
  const pendingActions =
    statusActionCard?.pendingActions ?? statusActionCard?.pending_actions ?? [];
  const actions = statusActionCard?.actions ?? [];

  if (!statusLabel && pendingActions.length === 0 && actions.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-xl border border-secondary/15 bg-surface p-4 shadow-sm sm:p-5"
      aria-label="Property workflow actions"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <ListChecks className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-text">
                Property workflow
              </h2>
              {statusLabel ? (
                <p className="text-sm text-muted">Status: {statusLabel}</p>
              ) : null}
            </div>
          </div>

          {pendingActions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {pendingActions.map((action) => (
                <span
                  key={action}
                  className="rounded-full border border-secondary/15 bg-page px-3 py-1 text-xs font-medium text-muted"
                >
                  {action}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {actions.length > 0 ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {actions.map((action) => (
              <Button
                key={action.id}
                size="sm"
                color={getActionButtonColor(action.tone)}
                variant={getActionButtonVariant(action.tone)}
                disabled={action.disabled}
                isLoading={action.isLoading}
                loadingLabel={action.loadingLabel}
                onClick={() => action.onClick?.()}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function PropertyDetailsScreen({
  propertyId,
}: PropertyDetailsScreenProps) {
  const router = useRouter();
  const {
    isLoading,
    isError,
    propertyDetails,
    guardDetails,
    isFavouriteLoading,
    locale,
    applicationKey,
    featureCatalog,
    tabs,
    toggleFavourite,
    openAgentEmail,
    openAgentPhone,
    openAgentWhatsApp,
    openOwnerEmail,
    openOwnerPhone,
    openOwnerWhatsApp,
    similarListings,
    isSimilarLoading,
    onSimilarClickEmail,
    onSimilarClickCall,
    onSimilarClickWhatsApp,
    canViewRestrictedTabs,
    showOwnerDetails,
    showAgentDetails,
    statusActionCard,
    workflowConfirmModal,
    rejectWorkflowModal,
    assignAgentModal,
    contactModal,
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
      <ContactModal contactModal={contactModal} />

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
        className="property-details-view"
        isLoading={isLoading}
        applicationKey={applicationKey}
        propertyDetails={propertyDetails}
        isFavouriteLoading={isFavouriteLoading}
        locale={locale}
        showAgent={showAgentDetails}
        showOwner={showOwnerDetails}
        showStatusActionCard={false}
        showPropertyMetrics={false}
        features={featureCatalog}
        tabs={tabs}
        onClickFavourite={toggleFavourite}
        onClickAgentEmail={openAgentEmail}
        onClickAgentPhone={openAgentPhone}
        onClickAgentWhatsApp={openAgentWhatsApp}
        onClickOwnerEmail={openOwnerEmail}
        onClickOwnerPhone={openOwnerPhone}
        onClickOwnerWhatsApp={openOwnerWhatsApp}
      />

      {guardDetails ? <GuardDetailsCard {...guardDetails} /> : null}

      {canViewRestrictedTabs ? (
        <PropertyStatusActionPanel statusActionCard={statusActionCard} />
      ) : null}

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
        onClickEmail={onSimilarClickEmail}
        onClickCall={onSimilarClickCall}
        onClickWhatsApp={onSimilarClickWhatsApp}
      />
    </div>
  );
}
