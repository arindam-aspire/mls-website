# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/AgencySignUpForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input, PhoneInput } from "@/src/components/ui"`
- `import { cn } from "@/src/lib/cn"`
- `import { useForm } from "@/src/hooks/useForm"`

# Exports

- `AgencySignUpForm`
- `AgencySignUpFormValues`

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

- `agencyName`
- `email`
- `password`
- `phoneCountryCode`
- `phoneNationalNumber`
- `tradeName`

## Actions

- Submit form
- Toggle password visibility

## Validations

- `agencyName`
  - Rules: `Required (non-empty)`
  - Message keys: `agencySignUpNameRequired`
- `email`
  - Rules: `Must match email format`, `Required (non-empty)`
  - Message keys: `signUpEmailInvalid`, `signUpEmailRequired`
- `password`
  - Rules: `Required`
  - Message keys: `signUpPasswordInvalid`, `signUpPasswordRequired`
- `phoneNationalNumber`
  - Rules: `Minimum 7 digits`, `Required (non-empty)`
  - Message keys: `signUpPhoneInvalid`, `signUpPhoneRequired`
- `tradeName`
  - Rules: `Required (non-empty)`
  - Message keys: `agencySignUpTradeNameRequired`

## Show/Hide Controls

- Password visibility toggles via `showPassword` state (eye icon controls input `type`).

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

See source in `src/features/auth/components/AgencySignUpForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/AgencySignUpForm.tsx` changes.
