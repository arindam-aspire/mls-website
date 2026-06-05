# Protected Layout (`src/layouts/protected-layout/`)

## Purpose

Placeholder folder for authenticated-only route chrome and wrappers that may be introduced later (for example, account area sidebars, protected page headers, or dashboard-specific shells).

## Current Status

- Wired to App Router `(main)` route group (`app/[locale]/(main)/layout.tsx`).
- **`ProtectedHeader`** implemented: responsive mobile bar (logo, notifications, menu) and desktop bar (search, language, theme, notifications, profile).
- **`ProtectedBottomTabBar`** on mobile (`< md`): Home, Listings, Favourites, Enquiry.
- **`ProtectedMobileMenu`** drawer wired from header (`< md`): account, nav (no Dashboard), settings cards, and public-style footer with logout confirm.
- **`ProtectedSidebar`** optional from `md+` (agency and agent only).
- `ProtectedDrawer` remains a placeholder (not mounted).

## Structure

```text
ProtectedLayout (index.tsx)
├── ProtectedSidebar (md+, agency/agent only)
└── column
    ├── ProtectedHeader
    ├── ProtectedMain (children)
    └── ProtectedFooter
```

## Files

| File | Role |
| --- | --- |
| [index.md](./index.md) | Protected layout composer |
| [ProtectedHeader.md](./ProtectedHeader.md) | Sticky protected header (responsive mobile + desktop actions) |
| [ProtectedMobileDrawer.md](./ProtectedMobileDrawer.md) | Mobile off-canvas drawer (single file: account, nav, settings, footer) |
| [ProtectedMobileMenu.md](./ProtectedMobileMenu.md) | Header menu → drawer wrapper |
| [ProtectedBottomTabBar.md](./ProtectedBottomTabBar.md) | Mobile bottom tabs |
| [protectedBottomTab.config.md](./protectedBottomTab.config.md) | Tab paths and permissions |
| [hooks/useProtectedBottomTabBar.md](./hooks/useProtectedBottomTabBar.md) | Tab filter + active state |
| [protectedMobileHeaderStyles.md](./protectedMobileHeaderStyles.md) | Shared mobile header class constants |
| [ProtectedSearchButton.md](./ProtectedSearchButton.md) | Header search icon (`lg+`) → property list |
| [ProtectedNotificationsButton.md](./ProtectedNotificationsButton.md) | Header bell icon button with unread dot |
| [ProtectedThemeButton.md](./ProtectedThemeButton.md) | Header light/dark theme toggle |
| [ProtectedProfileMenu.md](./ProtectedProfileMenu.md) | Header profile strip + menu |
| [hooks/useProtectedProfileMenu.md](./hooks/useProtectedProfileMenu.md) | Profile menu hook |
| [hooks/useProtectedHeader.md](./hooks/useProtectedHeader.md) | Header state and handlers |
| [ProtectedSidebar.md](./ProtectedSidebar.md) | Optional sidebar rail (`md+`, agency/agent) |
| [hooks/useProtectedSidebar.md](./hooks/useProtectedSidebar.md) | Sidebar visibility hook |
| [ProtectedSidebarNav.md](./ProtectedSidebarNav.md) | Sectioned sidebar navigation |
| [protectedSidebarNav.config.md](./protectedSidebarNav.config.md) | Nav sections/items config |
| [hooks/useProtectedSidebarNav.md](./hooks/useProtectedSidebarNav.md) | Nav filter + active state |
| [ProtectedDrawer.md](./ProtectedDrawer.md) | Large-screen drawer placeholder |
| [ProtectedMain.md](./ProtectedMain.md) | Main content wrapper for route children |
| [ProtectedFooter.md](./ProtectedFooter.md) | Footer placeholder |

## Planned Conventions

- Add `PascalCase` component files as protected layout pieces are implemented.
- Keep layout logic presentational in components and move business/state logic into feature hooks.
- Use semantic theme tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`) to support both light and dark modes.
- Keep responsive behavior mobile-first and maintain `rounded-xl` for layout containers and `rounded-lg` for controls.

## Dependencies

- Parent index: `.docs/src/layouts/README.md`
- Sibling layout modules:
  - `src/layouts/public-layout/`
  - `src/layouts/landing-layout/`
