"use client";

import { Wallet } from "lucide-react";
import type { AgencyCurrencyPreference } from "../types/profile.types";
import { AgencyDisplayPreferenceCard } from "./AgencyDisplayPreferenceCard";

export type AgencySettingsCurrencyCardProps = {
  preference: AgencyCurrencyPreference;
  onUpcomingFeature: () => void;
};

export function AgencySettingsCurrencyCard({
  preference,
  onUpcomingFeature,
}: AgencySettingsCurrencyCardProps) {
  return (
    <AgencyDisplayPreferenceCard
      icon={Wallet}
      preference={preference}
      onUpcomingFeature={onUpcomingFeature}
    />
  );
}
