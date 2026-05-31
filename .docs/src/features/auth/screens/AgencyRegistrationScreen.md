# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/AgencyRegistrationScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AUTH_QUERY_KEY, AUTH_VIEW } from "@/src/features/auth/authViews"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import { AgencySignUpForm } from "../components/AgencySignUpForm"`

# Exports

- `AgencyRegistrationScreen`

# State Management

_No significant state; presentational or config module._

# API Usage

- `useAgencySignUp` → `POST /agency/register` (`multipart/form-data`)
- Success → `auth=confirm-sign-up&from=agency-sign-up` (email OTP verification)

# Navigation

- Back uses `from` query via `resolveAgencySignUpBackUrl`:
  - `from=agency-sign-in` or `from=agency-email-sign-in` → that view
  - otherwise → account chooser (`?choose-account=true`)

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/features/auth/screens/AgencyRegistrationScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/AgencyRegistrationScreen.tsx` changes.
