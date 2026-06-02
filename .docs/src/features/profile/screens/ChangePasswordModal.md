# File Overview

Modal wrapper that hosts the profile change-password form.

**Source:** `src/features/profile/screens/ChangePasswordModal.tsx`

# Responsibilities

- Renders a modal shell with title, description, and close action.
- Composes `ChangePasswordForm` and controls modal open state through setter props.
- Delegates submit/API/toast logic to `useChangePasswordModal` hook.

# Imports

- Modal primitives from `@/src/components/ui/modal`.
- `ChangePasswordForm` from `src/features/profile/components/ChangePasswordForm.tsx`.
- `useChangePasswordModal` from `src/features/profile/hooks/useChangePasswordModal.ts`.

# Exports

- `ChangePasswordModal` component.
- `ChangePasswordModalProps` type.

# State Management

No local state. Controlled by parent-managed state setter props.

# API Usage

No direct API call in this screen component.
API interaction lives in `useChangePasswordModal`.

# Navigation

No direct navigation.

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `isOpenChangePassword` | `boolean` | Controls modal visibility |
| `setIsOpenChangePassword` | `Dispatch<SetStateAction<boolean>>` | Opens/closes modal from parent state |
| `isLoading` | `boolean` | Controls form submit loading state |

# Actions / Inputs

## Inputs

Inherited from `ChangePasswordForm`: current/new/confirm password fields.

## Actions

- Close modal using close button or backdrop interaction.
- Submit change-password form.

## Validations

Validation is handled inside `ChangePasswordForm`.

## Show/Hide Controls

Password visibility toggles are managed in `ChangePasswordForm`.

# UI Details

- Uses modal shell primitives with semantic theme tokens from shared UI.
- `ModalPanel` uses project-standard container radius (`rounded-xl`) through base modal styles.
- Responsive horizontal padding via `px-4 sm:px-6`.

# Flow Description

1. Parent opens modal by setting `isOpenChangePassword` to `true`.
2. Screen reads localized copy and callbacks from `useChangePasswordModal`.
3. User submits `ChangePasswordForm`.
4. Hook executes change-password mutation and handles success toast.
5. On success, hook closes modal via `setIsOpenChangePassword(false)`.
6. Backdrop/close button also close modal via `closeModal` from the hook.

# Dependencies

- Child component: `ChangePasswordForm`.
- Logic hook: `useChangePasswordModal`.
- Shared modal system: `src/components/ui/modal`.

# Notes

- User-visible text is localized through `src/messages/*/common.json`.
