"use client";

import type { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import {
  AGENCY_CURRENCIES,
  AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED,
  type AgencyCurrency,
} from "../constants/agencyPreferences";
import { useUpdateAgencyDisplayPreferences } from "../mutations/profile.mutation";
import type { Agency, AgencyCurrencyPreference } from "../types/profile.types";
import { normalizeAgencyCurrency } from "../utils/agencyPreferences.utils";

type CurrencyPreferenceTranslator = ReturnType<
  typeof useTranslations<"profile.displayPreferences">
>;

export function useAgencyCurrencyPreference(
  agencyId: string,
  agency: Agency | null,
  t: CurrencyPreferenceTranslator,
): AgencyCurrencyPreference {
  const { mutate, isPending } = useUpdateAgencyDisplayPreferences(agencyId);
  const value = normalizeAgencyCurrency(agency?.currency);

  const options = useMemo(
    () =>
      AGENCY_CURRENCIES.map((currencyValue) => ({
        value: currencyValue,
        code: t(`currency.${currencyValue.toLowerCase()}.code`),
        name: t(`currency.${currencyValue.toLowerCase()}.name`),
        symbol: t(`currency.${currencyValue.toLowerCase()}.symbol`),
      })),
    [t],
  );

  const onSelect = useCallback(
    (next: AgencyCurrency) => {
      if (!AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED) return;
      if (!agencyId || !agency || next === value) return;
      mutate({ currency: next });
    },
    [agency, agencyId, mutate, value],
  );

  return useMemo(
    () => ({
      title: t("currency.title"),
      description: t("currency.description"),
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
