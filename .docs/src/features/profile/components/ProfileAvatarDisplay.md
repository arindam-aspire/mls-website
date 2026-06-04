# File Overview

Shared circular profile/agency logo display: bordered `rounded-full` avatar with image or initials fallback. Used by [MyProfileCard.md](./MyProfileCard.md) (via [ProfileAvatarUpload.md](./ProfileAvatarUpload.md)) and [AgencyProfileCard.md](./AgencyProfileCard.md).

**Source:** `src/features/profile/components/ProfileAvatarDisplay.tsx`

# Responsibilities

- Render `Avatar` at `xl` size inside `size-28` / `sm:size-32` parent shell.
- Optional `children` for overlays (e.g. remove button in upload variant).

# Exports

- `ProfileAvatarDisplay`
- `ProfileAvatarDisplayProps`

# Dependencies

- `@/src/components/ui/avatar` — `Avatar`
