# File Overview

Custom hook that contains change-password modal logic and API orchestration.

**Source:** `src/features/profile/hooks/useChangePasswordModal.ts`

# Responsibilities

- Owns modal-level business logic for change-password submission.
- Maps form values to `/auth/change-password` request payload.
- Handles success feedback (toast) and modal close behavior.

# Imports

- `useTranslations` from `next-intl`.
- `useChangePassword` mutation hook from auth feature.
- `useToast` for user feedback.
- `ChangePasswordFormValues` type from profile components.

# Exports

- `useChangePasswordModal`
- `UseChangePasswordModalParams`

# State Management

- Uses React Query mutation state (`isPending`) from `useChangePassword`.
- Receives modal state setter from parent component.

# API Usage

- Calls `useChangePassword` (`POST /auth/change-password`).
- Request mapping:
  - `password` ← `newPassword`
  - `previous_password` ← `currentPassword`
- On success:
  - shows success toast
  - closes modal via `setIsOpenChangePassword(false)`

# Props / Parameters

| Param | Type | Description |
| --- | --- | --- |
| `setIsOpenChangePassword` | `Dispatch<SetStateAction<boolean>>` | Parent setter to close modal |

# Flow Description

1. Hook initializes i18n and toast utilities.
2. Hook initializes change-password mutation.
3. `handleSubmit` maps form values to API payload and triggers mutation.
4. On mutation success, success toast is displayed and modal is closed.
5. Hook returns render-ready values and callbacks to screen component.

# Dependencies

- Consumed by `src/features/profile/screens/ChangePasswordModal.tsx`.
- Depends on auth mutation layer for API execution.
