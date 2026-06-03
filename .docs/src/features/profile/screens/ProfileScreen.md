# File Overview

Route-level profile screen: toolbar, profile card, change-password modal, edit-profile modal, and photo coming-soon modals.

**Source:** `src/features/profile/screens/ProfileScreen.tsx`

# Responsibilities

- Compose `ProfilePageToolbar` and `MyProfileCard` with data from `useProfileScreen`.
- Open `ChangePasswordModal` on change-password action.
- Open `EditProfileModal` when the card **Edit** button is pressed.
- Open `UpcomingFeatureModal` for upload/remove photo placeholders.

# Flow Description

1. Toolbar shows page title/subtitle and **Change Password**.
2. **Change Password** → `ChangePasswordModal`.
3. Card **Edit** → `EditProfileModal` (email + phone).
4. Avatar camera → upload photo coming soon.
5. **Remove image** (when photo exists) → remove photo coming soon.

# Dependencies

- [useProfileScreen.md](../hooks/useProfileScreen.md)
- [EditProfileModal.md](./EditProfileModal.md)
- [ChangePasswordModal.md](./ChangePasswordModal.md)
