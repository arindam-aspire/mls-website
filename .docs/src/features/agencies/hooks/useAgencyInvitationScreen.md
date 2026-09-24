# File Overview

Agency invitation accept-form logic.

**Source:** `src/features/agencies/hooks/useAgencyInvitationScreen.ts` (Client hook)

# Responsibilities

- `GET /agency/invitations/validate?token=`
- Upload legal document via `POST /agency/invitations/document-upload` then PUT to the presigned URL
- `POST /agency/invitations/accept` with E.164 `phone` and `legal_document_s3_link`

# Imports

- `validateAgencyInvitation`, `uploadAgencyInvitationLegalDocument`, `acceptAgencyInvitation`
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
| Upload | `POST /agency/invitations/document-upload` | No |
| Accept | `POST /agency/invitations/accept` | No |

# Navigation

Password-setup URLs rewritten onto `getPublicAppOrigin()` as `/[locale]/agency-password-setup?token=`.

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
