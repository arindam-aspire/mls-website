# File Overview

Public invitation accept form for agencies.

**Source:** `src/features/agencies/components/AgencyInvitationForm.tsx` (Client Component)

# Responsibilities

- Collect agency name, trade name, read-only email, E.164 phone, and license file.
- Keep existing agency signup field styling.

# Imports

- `Input`, `PhoneInput`, `Button`, `LicenseDocumentUpload`
- `formatPhoneNumberE164`, `useForm`

# Exports

- `AgencyInvitationForm`
- `AgencyInvitationFormValues`

# State Management

`useForm` plus local license file / phone national number.

# API Usage

None (parent hook submits).

# Navigation

None.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `initialValues` | Prefill from validate payload |
| `onSubmit` | Values + `legalDocument` file |
| `isLoading` / `isUploading` | Disable controls |

# Actions / Inputs

Agency name, trade name, phone, license upload.

# UI Details

`rounded-lg` controls; semantic tokens.

# Flow Description

Validate locally (required names, E.164-length phone, license type/size) then call `onSubmit`.

# Dependencies

- `useAgencyInvitationScreen`

# Notes

Email is display-only (bound to the invitation).
