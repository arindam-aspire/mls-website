# File Overview

Password-change form component for the profile feature.

**Source:** `src/features/profile/components/ChangePasswordForm.tsx`

# Responsibilities

- Captures current password, new password, and confirm password inputs.
- Handles local validation and submit handoff.
- Supports password visibility toggles and loading state.

# Imports

- `useState` from React.
- `Eye`, `EyeOff`, `KeyRound`, `Lock` icons from `lucide-react`.
- `Button`, `Input` from `@/src/components/ui`.
- `PasswordStrengthIndicator` from `@/src/components/common/PasswordStrengthIndicator`.
- `useForm` from `@/src/hooks/useForm`.

# Exports

- `ChangePasswordForm` component.
- `ChangePasswordFormProps` type.
- `ChangePasswordFormValues` type.

# State Management

- Local state for three visibility toggles.
- Local form state and validation via `useForm`.

# API Usage

No direct API calls. Delegates submit payload through `onSubmit`.

# Navigation

No direct navigation.

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `onSubmit` | `(values: ChangePasswordFormValues) => void` | Handles validated form submission |
| `isLoading` | `boolean` | Disables/loading state for submit action |

# Actions / Inputs

## Inputs

- `currentPassword`
- `newPassword`
- `confirmPassword`

## Actions

- Toggle show/hide for each password field.
- Submit form.

## Validations

- Current password is required.
- New password is required and must match complexity pattern.
- Confirm password is required and must match new password.

## Show/Hide Controls

- `showCurrentPassword`, `showNewPassword`, `showConfirmPassword`.

# UI Details

- Uses semantic UI primitives and default control radii from shared components.
- Submit button uses `bg-primary` styling through button variant.
- Mobile-first spacing with responsive padding inherited from parent modal.

# Flow Description

1. User enters current/new/confirm password values.
2. Inline validation runs on blur/submit via `useForm`.
3. On valid submit, component passes values to parent `onSubmit`.
4. Parent controls async lifecycle through `isLoading`.

# Dependencies

- Parent modal: `ChangePasswordModal`.
- Shared components: `Input`, `Button`, `PasswordStrengthIndicator`.

# Notes

- Replace string literals with i18n keys when profile translations are introduced.
