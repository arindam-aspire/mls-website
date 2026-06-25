# File Overview

Sticky top bar for authenticated `(main)` routes. **`< md`:** logo (left), notifications + menu (right). **`md+`:** theme → search → language → notifications → profile (right); **user/owner** (no sidebar) also show MLS logo on the **left**, matching `PublicHeader`.

**Source:** `src/layouts/protected-layout/ProtectedHeader.tsx` (Client Component)

# Responsibilities

- Render protected-area header chrome (no search field).
- Delegate logic to `useProtectedHeader`.
- Mount `ProtectedMobileMenu` from the mobile menu button.

# Imports

- `useProtectedHeader`, `ProtectedLanguageSelect` (shared `HeaderLanguageSelect`), `Skeleton`, `IconButton`, `Link`, `Image`
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
| Theme / fullscreen / search / notifications / language / profile | `md+` | Theme toggle; fullscreen toggle; saved-search popover; notifications popover; `ProtectedLanguageSelect`; profile menu |
| Profile | `md+` when signed in | `ProtectedProfileMenu` |

# UI Details

- `protectedMobileHeaderBarClass`: flex `justify-between` on mobile; desktop row `justify-end`, or `justify-between` when `showHeaderLogo`.
- Header controls use the shared **`sm`** tier from `responsiveSizes` (`protectedHeaderIconButtonClass`, `controlSize="sm"` on popovers).
- Rounded outline icon triggers: circular `border-secondary/15` shell, `bg-surface`, muted icons; notifications show a numeric `danger` badge when `unreadCount` is passed.
- Semantic tokens; theme-aware logo via hook.

# Dependencies

- [hooks/useProtectedHeader.md](./hooks/useProtectedHeader.md)
- [ProtectedFullscreenButton.md](./ProtectedFullscreenButton.md)
- [ProtectedLanguageSelect.md](./ProtectedLanguageSelect.md)
- [ProtectedBottomTabBar.md](./ProtectedBottomTabBar.md) (search tab)
- [ProtectedMobileMenu.md](./ProtectedMobileMenu.md)

# Notes

- Profile menu is desktop-only in the header; mobile settings live in the drawer.
