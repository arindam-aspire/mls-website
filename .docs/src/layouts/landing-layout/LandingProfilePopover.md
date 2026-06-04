# File Overview

Landing profile popover module for authenticated desktop header actions.

**Source:** `src/layouts/landing-layout/LandingProfilePopover.tsx`

# Responsibilities

- Delegate to `ProfilePopover` with `overHero` (name/role on `lg+`, avatar, notifications aligned with public/protected headers).

# Imports

- `useLogout` from `src/features/auth/mutations/auth.mutation`
- `ConfirmModal` from `src/components/common/ConfirmModal`
- `Popover`, `Avatar`, `Button`, `IconButton`, and `UiLink` UI primitives

# Exports

- `LandingProfilePopover`

# Notes

- Wrapper only; behavior lives in [ProfilePopover.md](../public-layout/ProfilePopover.md).
