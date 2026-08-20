# Profile services (`src/features/profile/services/`)

API service layer for profile and agency endpoints.

## Purpose

- Isolate HTTP calls and request/response shaping for profile and agency APIs.
- Keep hooks and components independent from raw client details.

## Files

| Path | Role |
| --- | --- |
| [profile.service.md](./profile.service.md) | Agency list/update, offline registration, invitations, logos, profile picture, profile update |
| [index.md](./index.md) | Barrel for service exports |

## Offline registration flow

`AgenciesScreen` → `uploadOfflineAgencyLegalDocument` (`POST /uploads/presigned-url` + **PUT** to S3) → `createOfflineAgency` (`POST /agency/offline-registration`). Persist `file_url` / `object_key`, not `signed_read_url`.
