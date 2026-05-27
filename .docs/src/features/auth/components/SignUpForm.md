# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/SignUpForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input, PhoneInput } from "@/src/components/ui"`
- `import { useForm } from "@/src/hooks/useForm"`
- `import type { SignUpFormValues } from "../types/auth.types"`
- `import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator"`

# Exports

- `SignUpForm`

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
- `full_name`
- `password`
- `phone_number`

## Actions

- Submit form
- Toggle password visibility

## Validations

- `email`
  - Rules: `Must match email format`, `Required (non-empty)`
  - Message keys: `signUpEmailInvalid`, `signUpEmailRequired`
- `full_name`
  - Rules: `Required (non-empty)`
  - Message keys: `signUpFullNameInvalid`, `signUpFullNameRequired`
- `password`
  - Rules: `Required`
  - Message keys: `signUpPasswordInvalid`, `signUpPasswordRequired`
- `phone_number`
  - Rules: _Not auto-detected_
  - Message keys: `signUpPhoneInvalid`, `signUpPhoneRequired`

## Show/Hide Controls

- Password visibility toggles via `showPassword` state (eye icon controls input `type`).

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

See source in `src/features/auth/components/SignUpForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/SignUpForm.tsx` changes.
