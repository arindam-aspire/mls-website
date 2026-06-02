# Profile hooks (`src/features/profile/hooks/`)

Logic layer for the profile feature.

## Purpose

- Host profile-specific data fetching, derived state, and event callbacks.
- Keep business logic out of screen/component files.

## Current status

- Folder scaffolded for future profile hooks.

## Files

| Path | Role |
| --- | --- |
| [index.md](./index.md) | Barrel re-export for profile hooks |
| [useChangePasswordModal.md](./useChangePasswordModal.md) | Logic hook for change-password modal API/submit/close flow |
