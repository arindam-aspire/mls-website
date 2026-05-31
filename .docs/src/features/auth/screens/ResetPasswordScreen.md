# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/ResetPasswordScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import { ResetPasswordForm } from "../components/ResetPasswordForm"`

# Exports

- `ResetPasswordScreen`

# State Management

_No significant state; presentational or config module._

# API Usage

- `useResetPassword` → `POST /auth/forgot-password/confirm` with `{ email, code, new_password }`

# Navigation

- Reached after forgot-password OTP verification (`otp-flow=forgot`).
- Reads email from `otp-email` URL param; OTP code from `forgotPasswordOtp` in auth store.
- Submits `POST /auth/forgot-password/confirm` via `useResetPassword` with `{ email, code, new_password }`.
- On success → email sign-in view via `resolveSignInViewAfterPasswordReset`; clears `forgotPasswordOtp`.

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

See source in `src/features/auth/screens/ResetPasswordScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/ResetPasswordScreen.tsx` changes.
