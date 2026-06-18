"use client";

import { Ruler } from "lucide-react";
import type { AgencyMeasurementUnitPreference } from "../types/profile.types";
import { AgencyDisplayPreferenceCard } from "./AgencyDisplayPreferenceCard";

export type AgencySettingsMeasurementUnitCardProps = {
  preference: AgencyMeasurementUnitPreference;
  onUpcomingFeature: () => void;
};

export function AgencySettingsMeasurementUnitCard({
  preference,
  onUpcomingFeature,
}: AgencySettingsMeasurementUnitCardProps) {
  return (
    <AgencyDisplayPreferenceCard
      icon={Ruler}
      preference={preference}
      onUpcomingFeature={onUpcomingFeature}
    />
  );
}
