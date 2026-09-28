# File Overview

Builds the `POST /agency/invitations` body with public origin and email copy.

**Source:** `src/features/agencies/utils/buildAgencyInvitationCreateBody.ts`

# Responsibilities

- Merge form fields with invitation email copy. Does not send `frontend_url` or a From address. The backend builds absolute invitation links.
- Attach invitation email subject, body lines, and CTA label from `AGENCY_INVITATION_EMAIL`.
- `legal_document_s3_link` is the S3 `file_url` from the presigned upload, when the caller already uploaded a licence.

# Imports

- `AGENCY_INVITATION_EMAIL`
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

Does not navigate. The backend builds the absolute invitation URL. This helper does not send a frontend origin or a From address.

# Props / Parameters

| Argument | Notes |
| --- | --- |
| `body` | Email, optional agency name / trade name / phone from the admin form |

# Actions / Inputs

N/A.

# UI Details

N/A.

# Flow Description

1. Spread the original form body (`email`, names, E.164 phone, `legal_document_s3_link`).
2. Set `email_subject`, `email_greeting`, `email_body`, `email_cta_label`, `email_expiry_notice`, `email_ignore_notice`, `email_regards`, `email_sign_off`.

# Dependencies

- `src/features/profile/services/profile.service.ts` (`createAgencyInvitation`)
- `src/features/agencies/constants/agencyInvitationEmail.constants.ts`

# Notes

Does not hardcode hosts. Deployed environments must set `NEXT_PUBLIC_APP_URL` so invitation mail is not built from localhost.
