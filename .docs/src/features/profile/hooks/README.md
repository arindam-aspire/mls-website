# Profile hooks (`src/features/profile/hooks/`)

Logic layer for the profile feature.

## Purpose

- Host profile-specific data fetching, derived state, and event callbacks.
- Keep business logic out of screen/component files.

## Current status

- `useProfileScreen` — profile page user data and change-password modal state.
- `useChangePasswordModal` — change-password form submit flow.

## Files

| Path | Role |
| --- | --- |
| [index.md](./index.md) | Barrel re-export for profile hooks |
| [useProfileScreen.md](./useProfileScreen.md) | Profile screen logic — auth store user, labels, modal state |
| [useChangePasswordModal.md](./useChangePasswordModal.md) | Logic hook for change-password modal API/submit/close flow |
