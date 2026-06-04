"use client";

import type { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import {
  AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED,
  AGENCY_MEASUREMENT_UNITS,
  type AgencyMeasurementUnit,
} from "../constants/agencyPreferences";
import { useUpdateAgencyDisplayPreferences } from "../mutations/profile.mutation";
import type { Agency, AgencyMeasurementUnitPreference } from "../types/profile.types";
import { normalizeAgencyMeasurementUnit } from "../utils/agencyPreferences.utils";

type MeasurementPreferenceTranslator = ReturnType<
  typeof useTranslations<"profile.displayPreferences">
>;

export function useAgencyMeasurementUnitPreference(
  agencyId: string,
  agency: Agency | null,
  t: MeasurementPreferenceTranslator,
): AgencyMeasurementUnitPreference {
  const { mutate, isPending } = useUpdateAgencyDisplayPreferences(agencyId);
  const value = normalizeAgencyMeasurementUnit(agency?.measurement_unit);

  const options = useMemo(
    () =>
      AGENCY_MEASUREMENT_UNITS.map((unitValue) => ({
        value: unitValue,
        code: t(`measurementUnit.${unitValue.toLowerCase()}.code`),
        name: t(`measurementUnit.${unitValue.toLowerCase()}.name`),
        symbol: t(`measurementUnit.${unitValue.toLowerCase()}.symbol`),
      })),
    [t],
  );

  const onSelect = useCallback(
    (next: AgencyMeasurementUnit) => {
      if (!AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED) return;
      if (!agencyId || !agency || next === value) return;
      mutate({ measurement_unit: next });
    },
    [agency, agencyId, mutate, value],
  );

  return useMemo(
    () => ({
      title: t("measurementUnit.title"),
      description: t("measurementUnit.description"),
      value,
      options,
      onSelect,
      interactive: AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED,
      isUpdating: AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED && isPending,
      disabled: !agency,
    }),
    [agency, isPending, onSelect, options, t, value],
  );
}
