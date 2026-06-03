# File Overview

Profile page header: page title, subtitle, and change-password action.

**Source:** `src/features/profile/components/ProfilePageToolbar.tsx`

# Responsibilities

- Render `h1` page title and subtitle on the left (plain `div` wrapper, not a landmark `<header>`).
- Render action buttons on the right (stacked on mobile, row on `sm:`).

# Props / Parameters

| Prop | Type |
| --- | --- |
| `title` | `string` |
| `subtitle` | `string` |
| `changePasswordLabel` | `string` |
| `onChangePassword` | `() => void` |

# Actions / Inputs

- **Change Password** — calls `onChangePassword`.

# UI Details

- No extra section chrome (border/padding); layout shell (`ProtectedMain`) owns page spacing.
- Responsive gaps: `gap-2`, `md:gap-4`, `lg:gap-6` on main row and button group only (no gap between title and subtitle).
- Button: `size="sm"`, `rounded-lg`, outline inherit (change password).
- Touch-friendly full-width buttons on small screens.

# Dependencies

- [ProfileScreen.md](../screens/ProfileScreen.md)
