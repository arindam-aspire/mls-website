# Profile hooks (`src/features/profile/hooks/`)

Logic layer for the profile feature.

## Purpose

- Host profile-specific data fetching, derived state, and event callbacks.
- Keep business logic out of screen/component files.

## Current status

- `useProfileScreen` — profile page user data and change-password modal state.
- `useProfileAvatarUpload` — personal profile photo presigned upload/remove.
- `useAgencyLogoUpload` — agency logo presigned upload/remove (`/agency/{id}/logo`).
- `useEditAgencyModal` — edit agency form; optional license upload on save (`POST /agency/{id}/legal-document`).
- `useChangePasswordModal` — change-password form submit flow.
- `useAgencyCurrencyPreference` — agency currency (JOD/USD) selection + `PUT /agency/{id}`.
- `useAgencyMeasurementUnitPreference` — agency area unit (SQFT/SQM) selection + `PUT /agency/{id}`.
- `useAgencyDisplayPreferencesRows` — `UpcomingFeatureModal` state when persist is off.

- `useSelectAgencyModal` — select agency modal labels and close (agency picker UI pending).

## Files

| Path | Role |
| --- | --- |
| [index.md](./index.md) | Barrel re-export for profile hooks |
| [useProfileScreen.md](./useProfileScreen.md) | Profile screen logic — auth store user, labels, modal state |
| [useSelectAgencyModal.md](./useSelectAgencyModal.md) | Select agency modal — i18n and close handler |
| [useAgencyLogoUpload.md](./useAgencyLogoUpload.md) | Agency logo upload/remove on profile page |
| [useEditAgencyModal.md](./useEditAgencyModal.md) | Edit agency modal — form state, PUT, optional license upload |
| [useChangePasswordModal.md](./useChangePasswordModal.md) | Logic hook for change-password modal API/submit/close flow |
| [useAgencyCurrencyPreference.md](./useAgencyCurrencyPreference.md) | Agency display preference — currency |
| [useAgencyMeasurementUnitPreference.md](./useAgencyMeasurementUnitPreference.md) | Agency display preference — measurement unit |
| [useAgencyDisplayPreferencesRows.md](./useAgencyDisplayPreferencesRows.md) | Upcoming-feature modal for display preferences |
