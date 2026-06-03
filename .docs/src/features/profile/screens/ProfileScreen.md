# File Overview

Route-level profile screen: toolbar, profile card, change-password modal, separate edit email/phone modals, and avatar upload.

**Source:** `src/features/profile/screens/ProfileScreen.tsx`

# Responsibilities

- Compose `ProfilePageToolbar` and `MyProfileCard` with data from `useProfileScreen`.
- Open `ChangePasswordModal` on change-password action.
- Open `EditEmailModal` / `EditPhoneModal` from per-field edit actions on the card.
- Render `ProfileAvatarUpload` with upload/remove handlers from `useProfileAvatarUpload`.

# Flow Description

1. Toolbar shows page title/subtitle and **Change Password**.
2. **Change Password** → `ChangePasswordModal`.
3. Card email row **Edit** → `EditEmailModal` (request OTP → confirm).
4. Card phone row **Edit** → `EditPhoneModal` (request OTP → confirm).
5. Avatar camera → presigned upload flow; remove → `DELETE /auth/me/profile-picture`.

# Dependencies

- [useProfileScreen.md](../hooks/useProfileScreen.md)
- [EditEmailModal.md](./EditEmailModal.md)
- [EditPhoneModal.md](./EditPhoneModal.md)
- [ChangePasswordModal.md](./ChangePasswordModal.md)
