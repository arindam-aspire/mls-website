# File Overview

Profile summary card: avatar, name, role, and read-only personal information fields (email/phone with icons and verification status).

**Source:** `src/features/profile/components/MyProfileCard.tsx`

# Responsibilities

- Display user identity (avatar, name, role) and compact action buttons below the role: **Edit** (`profile.edit`, secondary ghost); **Remove image** (danger ghost, only when `profile_picture_url` is set).
- Render personal information from `fields` prop — **email and phone only** (system contact fields); each row uses `Mail` / `Phone` icons plus verification badge (**Verified** / **Not verified**) from `user.is_email_verified` / `user.is_phone_verified`.

# Props / Parameters

See `MyProfileCardProps` in `profile.types.ts` — all strings pre-translated by `useProfileScreen`. Includes `verifiedLabel` and `notVerifiedLabel` for contact rows.

# UI Details

- Wrapper: `flex w-full justify-center`; card: `w-full max-w-md`.
- Profile row: stacked centered on mobile; `md:flex-row` with name beside avatar, role below name.
- Avatar: [ProfileAvatarUpload.md](./ProfileAvatarUpload.md) — rounded with camera upload control.
- Email/phone rows: icon in `rounded-lg` primary-tinted box; value below label; verification badge (`rounded-lg` pill) with `CheckCircle` (success) or `XCircle` (danger) — same badge styling as earlier profile verification chips.
- Personal info: single column (`flex flex-col`), gaps `gap-2`, `md:gap-4`, `lg:gap-6`.

# Dependencies

- [useProfileScreen.md](../hooks/useProfileScreen.md)
- [ProfileScreen.md](../screens/ProfileScreen.md)
