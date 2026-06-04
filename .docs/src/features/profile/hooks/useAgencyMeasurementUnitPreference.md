# File Overview

Client hook for agency **measurement unit** display preference (SQFT / SQM): options from i18n, current value from agency, `PUT /agency/{id}` on change.

**Source:** `src/features/profile/hooks/useAgencyMeasurementUnitPreference.ts`

# Responsibilities

- Normalize `agency.measurement_unit` via `normalizeAgencyMeasurementUnit`.
- Build `options` from `AGENCY_MEASUREMENT_UNITS` and `profile.displayPreferences.measurementUnit.{sqft|sqm}.*` keys.
- When `AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED` is `true`, selection calls `useUpdateAgencyDisplayPreferences` with `{ measurement_unit }`. Currently `false` (read-only UI; upcoming).
- Expose `interactive`, `isUpdating` / `disabled` for the measurement panel in [AgencyDisplayPreferencesRows.md](../components/AgencyDisplayPreferencesRows.md).

# Exports

- `useAgencyMeasurementUnitPreference(agencyId, agency, t)` → `AgencyMeasurementUnitPreference`

# Dependencies

- [useProfileScreen.md](./useProfileScreen.md) — wires hook with `tDisplayPreferences`
- [profile.mutation.ts](../../mutations/profile.mutation.ts) — `useUpdateAgencyDisplayPreferences`
- [agencyPreferences.ts](../../../constants/agencyPreferences.ts) — `SQFT`, `SQM`
