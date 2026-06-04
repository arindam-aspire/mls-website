# File Overview

Display preferences on the agency card: currency and measurement unit rows, each with header + two selectable option cards.

**Source:** `src/features/profile/components/AgencyDisplayPreferencesRows.tsx`

# Responsibilities

- **Currency:** `Wallet` icon row, then JOD / USD cards. When `AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED` is `false`, any card click opens [UpcomingFeatureModal](../../../../components/common/UpcomingFeatureModal.tsx) (via [useAgencyDisplayPreferencesRows.md](../hooks/useAgencyDisplayPreferencesRows.md)).
- **Measurement unit:** `Ruler` icon row, then SQFT / SQM cards (`ft²` / `m²`); same upcoming-modal behavior when persist is off.
- Shared `PreferenceOptionCards` radiogroup grid (`sm:grid-cols-2`); no outer section border/background; opacity + `aria-busy` while updating.

# Dependencies

- [useAgencyCurrencyPreference.md](../hooks/useAgencyCurrencyPreference.md)
- [useAgencyMeasurementUnitPreference.md](../hooks/useAgencyMeasurementUnitPreference.md)
- [AgencyProfileCard.md](./AgencyProfileCard.md)
