# File Overview

Single-file off-canvas drawer for protected routes below `md`. Mirrors the public mobile menu: primary header, scrollable card sections (account, nav, settings), and a fixed account footer with logout confirmation.

**Source:** `src/layouts/protected-layout/ProtectedMobileDrawer.tsx`

# Responsibilities

- Dialog shell, backdrop, RTL panel animation (`duration-700`).
- Primary header with theme-aware MLS logo and outline `IconButton` close control (matches header menu open button) on `bg-surface`.
- Internal sections (not separate files), each in a `DrawerSectionCard` (title above `Card`):
  - **Account** — role-based profile label (`personalAndBusinessProfile` for admin/agency, else `profile` → `/my-profile`), Change Password, Notification Settings (`owner` / `registered_user` only)
  - **Preferences** — Language, Theme Mode
  - **My Activity** — **My Listings** (`owner`), **Manage Listings** (`admin` / `agency` / `agent`), Favourites, Saved Searches, Recently Viewed (`registered_user` / `owner`) via `filterProfileMenuItemsWithRoleAccess` (`List` icon)
  - `DrawerFooter` — avatar, name, role, logout
- Logout: close drawer → `ConfirmModal` → `useLogout`.

# Exports

- `ProtectedMobileDrawer`
- `ProtectedMobileDrawerProps`

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Drawer visibility |
| `onClose` | `() => void` | Close handler |
| `closeLabel` | `string` | i18n close `aria-label` |
| `className` | `string` | Optional root `Dialog` classes |

# UI Details

- Panel width: `w-[90vw]`, max `36rem`, height `h-dvh`.
- Section titles render **above** each `Card` (not inside the card).
- Header and footer: `bg-surface`; footer `border-t border-secondary/15`, outside scroll area.

# Dependencies

- [protectedMobileHeaderStyles.md](./protectedMobileHeaderStyles.md)
- [ProtectedMobileMenu.md](./ProtectedMobileMenu.md) (wrapper)
- [PublicMobileMenu](../../public-layout/PublicMobileMenu.md) (parity reference)

# Notes

- Activity links mirror profile menu routes; dashboard remains sidebar-only.
- All drawer UI lives in this one file per project preference.
