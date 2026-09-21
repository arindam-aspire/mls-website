# File Overview

TanStack React Query mutation hooks.

**Source:** `src/features/auth/mutations/auth.mutation.ts` (Client Component)

# Responsibilities

- TanStack React Query mutation hooks.

# Imports

- `import { confirmSignUp, forgotPassword, getLoggedInUser, logout, signInWithOtpRequest, signInWithOtpVerify, signInWithPassword, signUp } from "../services/auth.service"`
- `import { useToast } from "@/src/hooks/useToast"`
- `import { type ApiError } from "@/src/apis/core/error.normalizer"`
- `import { useAuthStore } from "../store/auth.store"`
- `import type { SignInResponse, SignInWithOtpResponse, SignInWithOtpVerifyResponse } from "../types/auth.types"`
- `import { navigateTo } from "@/src/utils/navigation.utils"`
- `import { AppLocale } from "@/src/i18n/routing"`

# Exports

- `useSignInWithPassword`
- `useLogout`
- `useSignUp`
- `useAgencySignUp`
- `useConfirmSignUp`
- `useResendConfirmation`
- `useSignInWithOtpRequest`
- `useSignInWithOtpVerify`
- `useForgotPassword`
- `useResetPassword`
- `useChangePassword`

# State Management

- **Zustand** `useAuthStore`
- **TanStack Query** queries/mutations

# API Usage

- `useResetPassword` → `POST /auth/forgot-password/confirm` — success toast, error toast on failure
- `useResendConfirmation` → `POST /auth/resend-confirmation` — 60s UI cooldown lives in `OtpVerificationForm`
- `useChangePassword` → `POST /auth/change-password` (auth required) — success/error toasts; consumer can close modal on success
- Signup 409 (`isConflictStatus`) uses existing-account copy and does not treat the account as created
- OTP request stores `data.session` only. Dev-only `otp` / `dev_email_otp` is never shown in the auth UI
- Logout always `clearAuth()` on settle (success or error) so tokens are dropped client-side

# Navigation

- **`navigateTo`** after logout → `/${locale}`.
- **`useLogout` `onSuccess`:** `clearNotificationQueryCache(queryClient)` then `clearAuth()` — drops cached notification list/unread count so the bell badge does not persist after sign-out.
- After password or OTP sign-in: `completeSignInFlow` closes the modal and redirects together. Dashboard path uses JWT role when present, else OTP/password `variables.role` (`admin` → agency dashboard). The href is locale-prefixed (`/en/dashboard`) and `navigateTo` must not strip that prefix — see [navigation.utils.md](../../../utils/navigation.utils.md).

# Props / Parameters

_N/A — non-component module._

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

_N/A._

# Flow Description

1. Component calls mutation hook.
2. Service hits API via `authClient`.
3. `onSuccess` / `onError` update store and toasts.
4. Logout redirects to `/${locale}`.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/mutations/auth.mutation.ts` changes.
