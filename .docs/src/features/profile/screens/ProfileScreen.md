# File Overview

Route-level profile screen: toolbar, profile card, change-password modal, separate edit email/phone modals, and avatar upload.

**Source:** `src/features/profile/screens/ProfileScreen.tsx`

# Responsibilities

- While `useProfileScreen().isLoading` (`isLoadingUser && !user`), render `ProfileScreenSkeleton` (toolbar + card placeholders).
- Compose `ProfilePageToolbar` and `MyProfileCard` with data from `useProfileScreen` when loaded.
- Open `ChangePasswordModal` on change-password action.
- Open `EditEmailModal` / `EditPhoneModal` from per-field edit actions on the card.
- Render `ProfileAvatarUpload` with upload/remove handlers from `useProfileAvatarUpload`.

# Flow Description

1. On first paint after `/my-profile` authorize, `AuthProvider` may still hydrate `user` → screen shows skeleton until `user` is set.
2. Toolbar shows page title/subtitle and **Change Password**.
3. **Change Password** → `ChangePasswordModal`.
4. Card email row **Edit** → `EditEmailModal` (request OTP → confirm).
5. Card phone row **Edit** → `EditPhoneModal` (request OTP → confirm).
6. Avatar camera → presigned upload flow; remove → `DELETE /auth/me/profile-picture`.

# Dependencies

- [ProfileScreenSkeleton.md](../components/ProfileScreenSkeleton.md)
- [useProfileScreen.md](../hooks/useProfileScreen.md)
- [EditEmailModal.md](./EditEmailModal.md)
- [EditPhoneModal.md](./EditPhoneModal.md)
- [ChangePasswordModal.md](./ChangePasswordModal.md)
