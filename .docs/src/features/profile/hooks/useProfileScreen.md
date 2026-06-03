# File Overview

Client hook for the profile screen: localized labels, change-password, edit (upcoming), and upload-photo (upcoming) modal state.

**Source:** `src/features/profile/hooks/useProfileScreen.ts`

# Responsibilities

- Provide `pageTitle`, `pageSubtitle`, and button labels via `profile` / `common` i18n.
- Build `myProfileCard.fields`: email and phone only (`kind`, `verified` flags); email via `maskEmail(..., { visibleLocalChars: 2 })`; phone via `maskStoredPhoneNumber` (e.g. `+962 7***4567`); labels via `profile.verified` / `profile.notVerified`.
- Own change-password, edit-profile, and upload-photo modal state; `onEdit` opens `EditProfileModal`.

# Exports

- `useProfileScreen`

# State Management

| State | Purpose |
| --- | --- |
| `isChangePasswordOpen` | `ChangePasswordModal` visibility |

# Actions / Inputs

| Action | Handler |
| --- | --- |
| Change password | `openChangePassword()` |

# Dependencies

- [ProfileScreen.md](../screens/ProfileScreen.md)
- [ProfilePageToolbar.md](../components/ProfilePageToolbar.md)
