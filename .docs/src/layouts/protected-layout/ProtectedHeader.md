# File Overview

Sticky top bar for authenticated `(main)` routes. **`< md`:** logo (left), notifications + menu (right). **`md+`:** theme → search → language → notifications → profile (right); **user/owner** (no sidebar) also show MLS logo on the **left**, matching `PublicHeader`.

**Source:** `src/layouts/protected-layout/ProtectedHeader.tsx` (Client Component)

# Responsibilities

- Render protected-area header chrome (no search field).
- Delegate logic to `useProtectedHeader`.
- Mount `ProtectedMobileMenu` from the mobile menu button.

# Imports

- `useProtectedHeader`, `SelectDropdown`, `Skeleton`, `IconButton`, `Link`, `Image`
- `SaveSearchPopover`, `NotificationsPopover`, `ProtectedThemeButton`, `ProtectedProfileMenu`, `ProtectedMobileMenu`
- `protectedMobileHeaderStyles`

# Exports

- `ProtectedHeader`

# Actions / Inputs

| Control | Breakpoint | Behavior |
| --- | --- | --- |
| Logo link | `< md` | Theme-aware MLS logo → home |
| Logo link | `md+` when `showHeaderLogo` | Same as public header (user/owner without sidebar) |
| Notifications | when signed in | `NotificationsPopover` (bell + list popover) |
| Menu | `< md` | Opens mobile drawer (system settings) |
| Theme / search / language / notifications | `md+` | Saved-search popover; notifications popover |
| Profile | `md+` when signed in | `ProtectedProfileMenu` |

# UI Details

- `protectedMobileHeaderBarClass`: flex `justify-between` on mobile; desktop row `justify-end`, or `justify-between` when `showHeaderLogo`.
- Semantic tokens; theme-aware logo via hook.

# Dependencies

- [hooks/useProtectedHeader.md](./hooks/useProtectedHeader.md)
- [ProtectedBottomTabBar.md](./ProtectedBottomTabBar.md) (search tab)
- [ProtectedMobileMenu.md](./ProtectedMobileMenu.md)

# Notes

- Profile menu is desktop-only in the header; mobile settings live in the drawer.
