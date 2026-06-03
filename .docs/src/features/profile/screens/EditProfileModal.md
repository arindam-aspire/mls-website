# File Overview

Modal to edit the logged-in user's email and phone number.

**Source:** `src/features/profile/screens/EditProfileModal.tsx`

# Responsibilities

- Render modal shell (title, description, close).
- Compose [EditProfileForm.md](../components/EditProfileForm.md) with props from [useEditProfileModal.md](../hooks/useEditProfileModal.md).

# API Usage

- `PATCH /auth/me` via `updateProfile` — see `profileEndpoints.UPDATE_PROFILE`.

# Dependencies

- [ProfileScreen.md](./ProfileScreen.md)
- [useEditProfileModal.md](../hooks/useEditProfileModal.md)
