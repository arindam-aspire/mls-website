# `useAgencySettingsScreen`

**Source:** `src/features/profile/hooks/useAgencySettingsScreen.ts`

Screen logic for **Agency Settings**: agency fetch, currency/measurement preferences, loading, and upcoming-feature modal.

## Return values

| Key | Description |
| --- | --- |
| `pageTitle` / `pageSubtitle` | From `profile.agencySettings` |
| `isLoading` | Auth hydration or agency `GET` pending |
| `currencyPreference` | `useAgencyCurrencyPreference` bindings |
| `measurementUnitPreference` | `useAgencyMeasurementUnitPreference` bindings |
| `upcomingFeatureModal` | Modal copy when persist is disabled |
| `openUpcomingFeatureModal` | Opens upcoming-feature modal |

## Data

- `agencyId` from `user.agency.agency_id`
- `useQuery(["agency", agencyId])` → `getAgencyById`
- Fallback agency summary from `/auth/me` while full agency loads

## Related

- [AgencySettingsScreen.md](../screens/AgencySettingsScreen.md)
- [useAgencyCurrencyPreference.md](./useAgencyCurrencyPreference.md)
- [useAgencyMeasurementUnitPreference.md](./useAgencyMeasurementUnitPreference.md)
