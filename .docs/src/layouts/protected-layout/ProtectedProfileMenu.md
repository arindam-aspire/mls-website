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

- **Divider:** `w-px` `bg-secondary/15`, hidden below `sm`.
- **Trigger (sm+):** `full_name` and role `text-end`; role from mapped API role name (`Agency`, `Agent`, `Owner`, `User`).
- **Avatar (trigger):** `size="md"`, circular, `!bg-page` / `text-text` for initials fallback; always visible on mobile (name/role hidden below `sm`).
- **Popover panel:** Header repeats avatar (`!bg-page`, `text-text`) + name; role or email fallback; same menu items as public profile popover.
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
