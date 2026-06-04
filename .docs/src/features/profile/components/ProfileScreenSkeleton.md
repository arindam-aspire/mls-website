# File Overview

Loading placeholder for the profile route: same outer spacing as `ProfileScreen`, composed of toolbar and card skeletons.

**Source:** `src/features/profile/components/ProfileScreenSkeleton.tsx`

# Responsibilities

- Mirror `ProfileScreen` layout (`gap-2 md:gap-4 lg:gap-6` column).
- Delegate to `ProfilePageToolbarSkeleton` and `MyProfileCardSkeleton`.

# Exports

- `ProfileScreenSkeleton`

# UI Details

- Uses shared `Skeleton` (`bg-primary-light/80`, `animate-skeleton-pulse`).
- No i18n (non-interactive, `aria-hidden` on children).

# Dependencies

- [ProfilePageToolbarSkeleton.md](./ProfilePageToolbarSkeleton.md)
- [MyProfileCardSkeleton.md](./MyProfileCardSkeleton.md)
- [ProfileScreen.md](../screens/ProfileScreen.md)
