# File Overview

Landing profile popover module for authenticated desktop header actions.

**Source:** `src/layouts/landing-layout/LandingProfilePopover.tsx`

# Responsibilities

- Render profile popover actions, account links, and logout confirmation flow.
- Handle profile navigation and logout interactions in landing header context.

# Imports

- `useLogout` from `src/features/auth/mutations/auth.mutation`
- `ConfirmModal` from `src/components/common/ConfirmModal`
- `Popover`, `Avatar`, `Button`, `IconButton`, and `UiLink` UI primitives

# Exports

- `LandingProfilePopover`

# Notes

- This file is now fully implemented in `landing-layout` (no re-export).
