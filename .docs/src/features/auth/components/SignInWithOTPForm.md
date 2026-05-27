# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/SignInWithOTPForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input, PhoneInput, ToggleButton } from "@/src/components/ui"`
- `import { useForm } from "@/src/hooks/useForm"`

# Exports

- `SignInWithOTPForm`
- `SignInOtpMethod`
- `SignInWithOTPFormValues`

# State Management

- **React** `useState`
- **`useForm`** hook

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

- `email`
- `phoneCountryCode`
- `phoneNationalNumber`

## Actions

- Submit form
- Switch sign-in method (email/phone or similar)

## Validations

- `email`
  - Rules: `Must match email format`, `Required (non-empty)`
  - Message keys: `forgotPasswordEmailInvalid`, `forgotPasswordEmailRequired`
- `phoneNationalNumber`
  - Rules: `Minimum 7 digits`, `Required (non-empty)`
  - Message keys: `forgotPasswordPhoneInvalid`, `forgotPasswordPhoneRequired`

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

See source in `src/features/auth/components/SignInWithOTPForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/SignInWithOTPForm.tsx` changes.
