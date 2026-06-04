# File Overview

Skeleton for `MyProfileCard`: centered card, avatar circle, section title, four field rows (two plain, two with badge + edit).

**Source:** `src/features/profile/components/MyProfileCardSkeleton.tsx`

# Responsibilities

- Match `article` shell: `max-w-md`, `rounded-xl`, `border-secondary/15`, `bg-page`, `p-4 sm:p-6`.
- Avatar: `size-28 sm:size-32` circular skeleton + hint line.
- Fields: icon box `size-10 rounded-lg`, label/value lines; email/phone rows include badge and edit placeholders.

# Exports

- `MyProfileCardSkeleton`

# UI Details

- Internal `ProfileFieldSkeleton` helper (not exported).
- `aria-hidden` on root.

# Dependencies

- [MyProfileCard.md](./MyProfileCard.md)
