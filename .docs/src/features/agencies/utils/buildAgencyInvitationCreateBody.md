# File Overview

Builds the `POST /agency/invitations` body with public origin and email copy.

**Source:** `src/features/agencies/utils/buildAgencyInvitationCreateBody.ts`

# Responsibilities

- Merge form fields with `frontend_url` from `getPublicAppOrigin()` (`NEXT_PUBLIC_APP_URL`, else current origin).
- Attach invitation email subject, body lines, and CTA label from `AGENCY_INVITATION_EMAIL`.
- Omit `frontend_url` when no origin can be resolved.

# Imports

- `getPublicAppOrigin` from `src/configs/environment.config.ts`
- `AGENCY_INVITATION_EMAIL` from agency invitation email constants
- `AgencyInvitationCreateRequest` from profile types

# Exports

| Export | Description |
| --- | --- |
| `buildAgencyInvitationCreateBody(body)` | Request payload for `createAgencyInvitation` |

# State Management

None.

# API Usage

Used only by `createAgencyInvitation` → `POST /agency/invitations`.

# Navigation

Does not navigate. `frontend_url` is the public origin the backend uses in the invitation CTA.

# Props / Parameters

| Argument | Notes |
| --- | --- |
| `body` | Email, optional agency name / trade name / phone from the admin form |

# Actions / Inputs

N/A.

# UI Details

N/A.

# Flow Description

1. Read public origin via `getPublicAppOrigin()`.
2. Spread the original form body.
3. Set `frontend_url` when origin is non-empty.
4. Set `email_subject`, `email_greeting`, `email_body`, `email_cta_label`, `email_expiry_notice`, `email_ignore_notice`, `email_regards`, `email_sign_off`.

# Dependencies

- `src/features/profile/services/profile.service.ts` (`createAgencyInvitation`)
- `src/features/agencies/constants/agencyInvitationEmail.constants.ts`

# Notes

Does not hardcode hosts. Deployed environments must set `NEXT_PUBLIC_APP_URL` so invitation mail is not built from localhost.
