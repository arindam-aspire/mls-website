# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/OTPVerificationScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import { OTPVerificationForm } from "../components/OTPVerificationForm"`
- `import { useForgotPassword, useSignInWithOtpVerify } from "../mutations/auth.mutation"`
- `import { useAuthStore } from "../store/auth.store"`
- `import { maskEmail, maskPhone } from "../maskContact"`

# Exports

- `OTPVerificationScreen`

# State Management

- **Zustand** `useAuthStore`

# API Usage

- Sign-in flow: `useSignInWithOtpVerify` → `POST /auth/login/otp/verify` with `{ username, code, session, role }`
- `session` and display OTP from URL query params (`otp-session`, `otp-code`), with store fallback via `resolveSignInOtpSession`
- On verify success, calls `onSighinSuccess` to close the auth modal

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

- Submit form

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

See source in `src/features/auth/screens/OTPVerificationScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/OTPVerificationScreen.tsx` changes.
