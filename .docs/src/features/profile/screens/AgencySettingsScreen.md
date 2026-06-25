# Agency Settings screen

**Source:** `src/features/profile/screens/AgencySettingsScreen.tsx`

Agency admin page for display preferences (currency and measurement unit).

## Layout

- Page title + subtitle from `profile.agencySettings`
- Responsive grid (`grid-cols-1 lg:grid-cols-2`) of preference cards
- `AgencySettingsScreenSkeleton` while agency data loads

## Components

| Component | Role |
| --- | --- |
| [AgencySettingsCurrencyCard.md](../components/AgencySettingsCurrencyCard.md) | JOD / USD card |
| [AgencySettingsMeasurementUnitCard.md](../components/AgencySettingsMeasurementUnitCard.md) | Sq. feet / Sq. meters card |
| [UpcomingFeatureModal](../../../components/common/UpcomingFeatureModal.tsx) | Shown when persist flag is off |

## Hook

- [useAgencySettingsScreen.md](../hooks/useAgencySettingsScreen.md)

## Route

`/agency-settings` — `useAuthorize("AGENCY_SETTINGS")`
