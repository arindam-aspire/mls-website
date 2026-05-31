# File Overview

Route-level screen component composing feature UI.

**Source:** `src/features/auth/screens/ConfirmSignUpScreen.tsx` (Client Component)

# Responsibilities

- Route-level screen component composing feature UI.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AuthModalHeader } from "../components/AuthModalHeader"`
- `import { OTPVerificationForm } from "../components/OTPVerificationForm"`
- `import { useConfirmSignUp, useSignUp } from "../mutations/auth.mutation"`
- `import { useToast } from "@/src/hooks/useToast"`
- `import { useAuthStore } from "../store/auth.store"`

# Exports

- `ConfirmSignUpScreen`

# State Management

- **Zustand** `useAuthStore`

# API Usage

- `useConfirmSignUp` → `POST /auth/confirm-signup` with `{ email, code }`
- Resend: `useSignUp` (user/owner) or `useAgencySignUp` (agency) from stored pending registration
- After verify success → email sign-in view via `resolveSignInViewFromSignUpReturnView(from)` (`user-sign-in`, `owner-sign-in`, or `agency-email-sign-in`)
- Redirect runs in `confirmSignUpMutate` `onSuccess` **before** clearing pending registration, avoiding a race with a missing-email guard
- Contact email: `otp-email` query param first, then `pendingSignUp` / `pendingAgencySignUp` from store

# Navigation

- Reached after successful user, owner, or agency registration (`from=user-sign-up`, `owner-sign-up`, or `agency-sign-up`)
- Registration screens pass `contactEmail` in URL (`otp-email`) when navigating here
- Pending email fallback from `pendingSignUp` or `pendingAgencySignUp` in auth store (resend)

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

See source in `src/features/auth/screens/ConfirmSignUpScreen.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/screens/ConfirmSignUpScreen.tsx` changes.
