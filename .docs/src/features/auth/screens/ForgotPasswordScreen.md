# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/ForgotPasswordScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import type { ForgotPasswordFormValues } from "../types/auth.types"`
- `import { useForgotPassword } from "../mutations/auth.mutation"`
- `import { useToast } from "@/src/hooks/useToast"`

# Exports

- `ForgotPasswordScreen`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Opened from sign-in via `?auth=forgot-password&from=<sign-in-view>`.
- After OTP request success → `otp-verify` with **`from` preserved** (original sign-in view, not `forgot-password`).
- Back → returns to sign-in view from `from`.

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

- `email`
- `phoneCountryCode`
- `phoneNationalNumber`

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

See source in `src/features/auth/screens/ForgotPasswordScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/ForgotPasswordScreen.tsx` changes.
