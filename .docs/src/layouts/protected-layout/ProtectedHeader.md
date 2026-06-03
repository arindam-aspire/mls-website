# File Overview

Sticky top bar for authenticated `(main)` routes. **`< md`:** logo (left), notifications + menu (right). **`md+`:** language, theme, notifications, profile (right). Property search is on the center bottom tab (`/property-list`).

**Source:** `src/layouts/protected-layout/ProtectedHeader.tsx` (Client Component)

# Responsibilities

- Render protected-area header chrome (no search field).
- Delegate logic to `useProtectedHeader`.
- Mount `ProtectedMobileMenu` from the mobile menu button.

# Imports

- `useProtectedHeader`, `SelectDropdown`, `Skeleton`, `IconButton`, `Link`, `Image`
- `ProtectedThemeButton`, `ProtectedNotificationsButton`, `ProtectedProfileMenu`, `ProtectedMobileMenu`
- `protectedMobileHeaderStyles`, `UpcomingFeatureModal`

# Exports

- `ProtectedHeader`

# Actions / Inputs

| Control | Breakpoint | Behavior |
| --- | --- | --- |
| Logo link | `< md` | Theme-aware MLS logo → home |
| Notifications | when signed in | Upcoming-feature modal |
| Menu | `< md` | Opens mobile drawer (system settings) |
| Language / theme / profile | `md+` | Desktop actions |

# UI Details

- `protectedMobileHeaderBarClass`: flex `justify-between` on mobile; desktop row `justify-end`.
- Semantic tokens; theme-aware logo via hook.

# Dependencies

- [hooks/useProtectedHeader.md](./hooks/useProtectedHeader.md)
- [ProtectedBottomTabBar.md](./ProtectedBottomTabBar.md) (search tab)
- [ProtectedMobileMenu.md](./ProtectedMobileMenu.md)

# Notes

- Profile menu is desktop-only in the header; mobile settings live in the drawer.
