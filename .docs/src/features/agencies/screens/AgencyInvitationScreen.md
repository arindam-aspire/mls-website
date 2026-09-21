# File Overview

Public agency invitation accept screen (email deep link).

**Source:** `src/features/agencies/screens/AgencyInvitationScreen.tsx` (Client Component)

# Responsibilities

- Validate `?token=` and collect agency name, trade name, E.164 phone, and legal document.
- After accept, show password-setup link when the API returns one.

# Imports

- `useAgencyInvitationScreen`
- `AgencyInvitationForm`, `Button`, `CopyLinkBar`

# Exports

- `AgencyInvitationScreen`

# State Management

See hook.

# API Usage

See hook.

# Navigation

Route: `/en/agency-invitation?token=…` (locale-prefixed). Unprefixed `/agency-invitation` redirects to English.

# Props / Parameters

None.

# Actions / Inputs

- Form fields via `AgencyInvitationForm`
- Copy / open password setup
- Go to sign in

# UI Details

- Card: `rounded-xl border-secondary/15 bg-surface`
- Semantic tokens; mobile-first padding

# Flow Description

loading → form or error → success (optional password-setup link)

# Dependencies

- `useAgencyInvitationScreen`
- `AgencyInvitationForm`

# Notes

Backend sends the invitation email. This screen does not call SES.
