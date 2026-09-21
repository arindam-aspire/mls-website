# File Overview

Public agency password-setup screen from email links.

**Source:** `src/features/auth/screens/AgencyPasswordSetupScreen.tsx` (Client Component)

# Responsibilities

- Read `token` from the query string.
- Submit `POST /agency/password/setup` with `{ token, password }`.
- Redirect users without a token, or after success, toward sign-in.

# Imports

- `ResetPasswordForm`, `Button`
- `setupAgencyPassword`
- `useTranslations("auth.agencyPasswordSetup")`

# Exports

- `AgencyPasswordSetupScreen`

# State Management

Local `isSubmitting` / `isSuccess`.

# API Usage

`POST /agency/password/setup` without auth.

# Navigation

`/en/agency-password-setup?token=…`. Unprefixed `/agency-password-setup` redirects to English.

# Props / Parameters

None.

# Actions / Inputs

New password + confirm (via `ResetPasswordForm`).

# UI Details

`rounded-xl` card; semantic tokens; `rounded-lg` form controls.

# Flow Description

1. Missing token → error + back to sign in.
2. Submit password → toast + success panel.
3. Backend message is shown when present.

# Dependencies

- Landing page `app/[locale]/(landing)/agency-password-setup/page.tsx`

# Notes

Does not send email. The backend already emailed this link.
