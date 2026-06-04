# File Overview

Route-level profile screen: toolbar, profile card, change-password modal, separate edit email/phone modals, and avatar upload.

**Source:** `src/features/profile/screens/ProfileScreen.tsx`

# Responsibilities

- While `useProfileScreen().isLoading` (`isLoadingUser && !user`), render `ProfileScreenSkeleton` (toolbar + card placeholders).
- Compose `ProfilePageToolbar`, `MyProfileCard`, optional `MyProfileCardSkeleton` while agency loads, and `AgencyProfileCard` from `useProfileScreen`.
- **lg+ layout (agency users):** `MyProfileCard` in a sticky aside (`lg:sticky lg:top-24`); agency skeleton/card in a flex main column so the personal card stays pinned while the agency card scrolls.
- **md/lg (non-agency users):** only `MyProfileCard` — centered horizontally (`justify-center`); no agency column.
- Open `ChangePasswordModal` on change-password action.
- Open `EditEmailModal` / `EditPhoneModal` from per-field edit actions on the card.
- Render `ProfileAvatarUpload` with upload/remove handlers from `useProfileAvatarUpload`.

# Flow Description

1. On first paint after `/my-profile` authorize, `AuthProvider` may still hydrate `user` → screen shows skeleton until `user` is set.
2. Toolbar shows page title/subtitle and **Change Password**.
3. **Change Password** → `ChangePasswordModal`.
4. Card email row **Edit** → `EditEmailModal` (request OTP → confirm).
5. Card phone row **Edit** → `EditPhoneModal` (request OTP → confirm).
6. Personal avatar camera → `POST /auth/me/profile-picture` presigned upload; remove → `DELETE /auth/me/profile-picture`.
7. Agency logo (agency users) → `POST /agency/{agencyId}/logo` presigned upload; remove → `DELETE /agency/{agencyId}/logo`.
8. **Edit agency** → [EditAgencyModal.md](./EditAgencyModal.md): `PUT /agency/{agencyId}`; optional license file → `POST /agency/{agencyId}/legal-document`.

# Dependencies

- [ProfileScreenSkeleton.md](../components/ProfileScreenSkeleton.md)
- [useProfileScreen.md](../hooks/useProfileScreen.md)
- [EditEmailModal.md](./EditEmailModal.md)
- [EditPhoneModal.md](./EditPhoneModal.md)
- [ChangePasswordModal.md](./ChangePasswordModal.md)
