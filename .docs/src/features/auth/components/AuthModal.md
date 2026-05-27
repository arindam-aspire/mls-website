# File Overview

Feature or shared UI component.

**Source:** `src/features/auth/components/AuthModal.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { usePathname, useRouter } from "@/src/i18n/navigation"`
- `import { AgencyEmailSignInScreen } from "../screens/AgencyEmailSignInScreen"`
- `import { AgencyRegistrationScreen } from "../screens/AgencyRegistrationScreen"`
- `import { AgencySignInScreen } from "../screens/AgencySignInScreen"`
- `import { AccountChooseScreen } from "../screens/AccountChooseScreen"`
- `import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen"`
- `import { ResetPasswordScreen } from "../screens/ResetPasswordScreen"`
- `import { SignInScreen } from "../screens/SignInScreen"`
- `import { OTPVerificationScreen } from "../screens/OTPVerificationScreen"`
- `import { SignInWithOTPScreen } from "../screens/SignInWithOTPScreen"`
- `import { SocialRegistrationScreen } from "../screens/SocialRegistrationScreen"`
- `import { SocialSignInScreen } from "../screens/SocialSignInScreen"`
- `import { UserRegistrationScreen } from "../screens/UserRegistrationScreen"`
- `import { ConfirmSignUpScreen } from "../screens/ConfirmSignUpScreen"`

# Exports

- `AuthModal`
- `AUTH_QUERY_KEY`
- `AUTH_RETURN_VIEW_QUERY_KEY`
- `AUTH_VIEW`
- `buildAuthModalUrl`
- `CHOOSE_ACCOUNT_QUERY_KEY`
- `resolveAccountTypeAuthView`
- `resolveEmailSignInView`
- `resolveEmailSignUpView`
- `type AuthView`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).
- Auth modal: query `?auth=<view>` on current pathname (see `authViews.ts`).

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

1. `useSearchParams` reads `auth` query key.
2. Valid view renders matching auth screen inside `Modal`.
3. Close clears auth query via locale-aware `useRouter`.
4. Sign-in success callback closes modal.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/components/AuthModal.tsx` changes.
