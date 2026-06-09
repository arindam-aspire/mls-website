# File Overview

Protected-header profile control: vertical divider, name + role, avatar trigger, and dropdown menu (not `ProfilePopover`).

**Source:** `src/layouts/protected-layout/ProtectedProfileMenu.tsx` (Client Component)

# Responsibilities

- Render header profile strip per design (separator | name / role | avatar).
- Open popover with account links and sign-out.
- Delegate state and handlers to `useProtectedProfileMenu`.

# Imports

- `useProtectedProfileMenu` from `./hooks/useProtectedProfileMenu`
- `Popover`, `Avatar`, `ConfirmModal`, menu `UiLink` / `Button`
- `LoggedInUser` type

# Exports

- `ProtectedProfileMenu`
- `ProtectedProfileMenuProps`

# State Management

- Hook: logout confirm modal, `useLogout`, menu navigation.

# Navigation

- Menu paths: `/my-profile`, `/listing`, `/favourites`, etc. (locale-prefixed via `useRouter`).

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `user` | `LoggedInUser` | Display name, avatar, role |
| `className` | `string` | Wrapper flex row |

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Click trigger | Opens popover |
| Menu link | Navigate + close popover |
| Sign out | `ConfirmModal` → `useLogout` |

# UI Details

- **Divider:** `w-px` `bg-secondary/15`, visible from `lg` only (with name/role block).
- **Trigger (`lg+`):** `full_name` and role `text-end`; hidden on `md` (avatar-only).
- **Avatar (trigger):** `size="md"`, circular, `!bg-page` / `text-text`; always visible from `md` up in the desktop header bar.
- **Popover panel:** Header repeats avatar (`!bg-page`, `text-text`) + name; role or email fallback. Menu links are role-specific: full list for owner/user; profile + sign out only for agency/agent (see `useProtectedProfileMenu`).
- Semantic tokens; light/dark via theme.

# Flow Description

1. User sees separator, name/role (desktop), and avatar in header.
2. Click opens anchored popover (`bottom end`).
3. User navigates or confirms logout.

# Dependencies

- [hooks/useProtectedProfileMenu.md](./hooks/useProtectedProfileMenu.md)
- [ProtectedHeader.md](./ProtectedHeader.md)

# Notes

- Role subtitle uses fixed `roles[0].name` → `auth.accountType*` mapping (not API description).
