# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/ResetPasswordForm.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { Button, Input } from "@/src/components/ui"`
- `import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator"`
- `import { useForm } from "@/src/hooks/useForm"`
- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews"`

# Exports

- `ResetPasswordForm`
- `ResetPasswordFormValues`

# State Management

- **React** `useState`
- **`useForm`** hook

# API Usage

_N/A unless extended._

# Navigation

- Props: `onSubmit(password)`, `isLoading`.
- Screen owns API call and redirect; form validates and delegates password on submit.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `onSubmit` | Called with validated new password string |
| `isLoading` | Disables submit while reset mutation is pending |

# Actions / Inputs

## Inputs

- `confirmPassword`
- `password`

## Actions

- Submit form

## Validations

- `confirmPassword`
  - Rules: `Required`
  - Message keys: `resetPasswordConfirmMismatch`, `resetPasswordConfirmRequired`
- `password`
  - Rules: `Required`
  - Message keys: `resetPasswordInvalid`, `resetPasswordNewRequired`

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- **`PasswordStrengthIndicator`** below new-password field (same as user sign-up)
- Submit button: **`KeyRound`** icon (`size-5`), matching other auth primary actions

# Flow Description

See source in `src/features/auth/components/ResetPasswordForm.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/ResetPasswordForm.tsx` changes.
