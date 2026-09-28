# File Overview

Agency invitation accept-form logic.

**Source:** `src/features/agencies/hooks/useAgencyInvitationScreen.ts` (Client hook)

# Responsibilities

- `GET /agency/invitations/validate?token=`
- Prefill email, names, phone (`data.phone`, else `data.phone_number`), and `legal_document_s3_link`
- If the user picks a new licence, upload it with `POST /uploads/presigned-url` (`context: agency_legal_document`), PUT the bytes, and send `data.file_url`. Otherwise send the URL from validate
- `POST /agency/invitations/accept` with E.164 `phone` / `phone_number` and `legal_document_s3_link`

# Imports

- `validateAgencyInvitation`, `uploadAgencyLegalDocumentFile`, `acceptAgencyInvitation`
- `rewriteAgencyPasswordSetupLink`
- `useSearchParams`, `useRouter`, `useToast`, `useTranslations`

# Exports

- `useAgencyInvitationScreen`

# State Management

Local React state for invitation, step, and upload/submit flags.

# API Usage

| Step | Endpoint | Auth |
| --- | --- | --- |
| Validate | `GET /agency/invitations/validate?token=` | No |
| Upload (only when a new file is selected) | `POST /uploads/presigned-url` then PUT `data.upload_url` | No |
| Accept | `POST /agency/invitations/accept` | No |

# Navigation

Password-setup URLs keep the backend origin and path `/agency-password-setup?token=`. The token is read from the query string. The host is not replaced with localhost.

# Props / Parameters

None.

# Actions / Inputs

`onSubmit`, `onGoToSignIn`, `onOpenPasswordSetup`, `onCopyPasswordSetupLink`

# UI Details

N/A.

# Flow Description

1. Missing token → error step.
2. Validate hydrates name/trade/email.
3. Submit uploads the license, then accept.
4. Success shows setup link when present.

# Dependencies

- `AgencyInvitationScreen`
- `src/features/agencies/utils/normalizeAgencyInvitationLink.ts`

# Notes

`legal_document_s3_link` is the persisted `file_url` / `object_key`, not `signed_read_url`.
