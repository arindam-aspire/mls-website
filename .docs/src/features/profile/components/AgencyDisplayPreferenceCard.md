# Agency display preference card

**Source:** `src/features/profile/components/AgencyDisplayPreferenceCard.tsx`

Shared card shell for a single agency display preference (icon, title, description, option grid).

## Exports

- `AgencyDisplayPreferenceCard` — generic card for any `AgencySelectablePreference`
- `AgencyDisplayPreferenceCardSkeleton` — loading placeholder

## Used by

- [AgencySettingsCurrencyCard.md](./AgencySettingsCurrencyCard.md)
- [AgencySettingsMeasurementUnitCard.md](./AgencySettingsMeasurementUnitCard.md)

## UI

- Outer `Card` / `CardContent` (`rounded-xl`)
- Option rows use [DisplayPreferenceOptionCard.md](./DisplayPreferenceOptionCard.md)
- When `interactive` is false, option clicks call `onUpcomingFeature`
