# File Overview

Profile UI props and profile API request/response types.

**Source:** `src/features/profile/types/profile.types.ts`

# Exports (UI)

| Type | Purpose |
| --- | --- |
| `ProfileInfoField` | `{ label, value }` for profile field rows |
| `MyProfileCardUser` | User subset for `MyProfileCard` header |
| `MyProfileCardProps` | Full props for `MyProfileCard` |
| `AgencyProfileCardProps` | Props for `AgencyProfileCard` |

# Exports (API)

Profile update/verify and picture upload types (`UpdateProfileRequest`, `ProfileUpdateRequestResponse`, etc.) plus agency detail types (`Agency`, `GetAgencyResponse` for `GET /agency/:id`).

### `Agency`

Includes `logo_url` (agency branding for the profile card and `POST/DELETE /agency/:id/logo`) and `profile_picture_url` when returned by the API (separate from the agency logo). Display preferences: `currency` (`JOD` \| `USD`), `measurement_unit` (`SQFT` \| `SQM`).

### Agency API `data` shapes

| Endpoint | Raw `data` | Normalized |
| --- | --- | --- |
| `GET /agency/:id` | `Agency` or `AgencyApiPayload` | `NormalizedGetAgencyResponse` (`data` = `Agency`) via `normalizeGetAgencyResponse` |
| `PUT /agency/:id` | `AgencyApiPayload` (`agency`, optional `legal_document_upload`) | `unwrapAgencyFromResponseData` in `updateAgency` |

**Source:** `src/features/profile/utils/agencyApi.utils.ts`

# Dependencies

- Re-exported from `types/index.ts`.
