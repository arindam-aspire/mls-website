# File Overview

Client hook for the profile screen: localized labels, change-password modal state, and separate edit email/phone modal state.

**Source:** `src/features/profile/hooks/useProfileScreen.ts`

# Responsibilities

- Provide `pageTitle`, `pageSubtitle`, and button labels via `profile` / `common` i18n.
- Build `myProfileCard` props (personal info fields, avatar, role).
- Own `isChangePasswordOpen`, `isEditEmailOpen`, `isEditPhoneOpen`.

# Exports

- `useProfileScreen`

# State Management

| State | Purpose |
| --- | --- |
| `isChangePasswordOpen` | `ChangePasswordModal` visibility |
| `isEditEmailOpen` | `EditEmailModal` visibility |
| `isEditPhoneOpen` | `EditPhoneModal` visibility |

# Actions / Inputs

| Action | Handler |
| --- | --- |
| Change password | `openChangePassword()` |
| Edit email | `openEditEmail()` |
| Edit phone | `openEditPhone()` |

# Dependencies

- [ProfileScreen.md](../screens/ProfileScreen.md)
- [ProfilePageToolbar.md](../components/ProfilePageToolbar.md)
