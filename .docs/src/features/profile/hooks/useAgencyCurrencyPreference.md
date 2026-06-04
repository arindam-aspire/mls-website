# File Overview

Client hook for agency **currency** display preference (JOD / USD): options from i18n, current value from agency, `PUT /agency/{id}` on change.

**Source:** `src/features/profile/hooks/useAgencyCurrencyPreference.ts`

# Responsibilities

- Normalize `agency.currency` via `normalizeAgencyCurrency`.
- Build `options` from `AGENCY_CURRENCIES` and `profile.displayPreferences.currency.{jod|usd}.*` keys.
- When `AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED` is `true`, selection calls `useUpdateAgencyDisplayPreferences` with `{ currency }`. Currently `false` (read-only UI; upcoming).

# Exports

- `useAgencyCurrencyPreference(agencyId, agency, t)` → `AgencyCurrencyPreference`
