"use client";

import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { AgencySettingsCurrencyCard } from "@/src/features/profile/components/AgencySettingsCurrencyCard";
import { AgencySettingsMeasurementUnitCard } from "@/src/features/profile/components/AgencySettingsMeasurementUnitCard";
import { AgencySettingsScreenSkeleton } from "@/src/features/profile/components/AgencySettingsScreenSkeleton";
import { useAgencySettingsScreen } from "@/src/features/profile/hooks/useAgencySettingsScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export function AgencySettingsScreen() {
  const {
    pageTitle,
    pageSubtitle,
    isLoading,
    currencyPreference,
    measurementUnitPreference,
    upcomingFeatureModal,
    openUpcomingFeatureModal,
  } = useAgencySettingsScreen();

  if (isLoading) {
    return <AgencySettingsScreenSkeleton />;
  }

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
        <header className="min-w-0">
          <h1 className={headingPageClasses}>{pageTitle}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start lg:gap-6">
          <AgencySettingsCurrencyCard
            preference={currencyPreference}
            onUpcomingFeature={openUpcomingFeatureModal}
          />
          <AgencySettingsMeasurementUnitCard
            preference={measurementUnitPreference}
            onUpcomingFeature={openUpcomingFeatureModal}
          />
        </div>
      </div>

      <UpcomingFeatureModal
        open={upcomingFeatureModal.open}
        onClose={upcomingFeatureModal.onClose}
        title={upcomingFeatureModal.title}
        subtitle={upcomingFeatureModal.subtitle}
        description={upcomingFeatureModal.description}
        dismissLabel={upcomingFeatureModal.dismissLabel}
      />
    </>
  );
}
