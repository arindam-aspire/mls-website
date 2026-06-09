# File Overview

Optional collapsible left rail for **agency** and **agent** users (`md+`).

**Source:** `src/layouts/protected-layout/ProtectedSidebar.tsx` (Client Component)

## Responsibilities

- Render when `useProtectedSidebar().isVisible` (agency/agent from `/auth/me` **or** JWT `loggedInUserRole`); does not wait for `/auth/me` when JWT already carries the role.
- Brand link to `/` with theme-aware MLS logo or favicon when collapsed.
- Collapse toggle straddling the sidebar border.

## Logo behavior

| Sidebar state | Asset |
| --- | --- |
| Expanded + light theme | `MLS_Light_Logo.png` |
| Expanded + dark theme | `MLS_Dark_Logo.png` |
| Collapsed | `favicon.png` (cube icon) |

Resolved in `useProtectedSidebar` via `useTheme()`. `alt` uses `common.brand`.

## UI Details

- Logo: centered (`justify-center`); collapsed `size-14`, expanded `h-[4.25rem] sm:h-[4.75rem] lg:h-20`.
- Toggle: `end-0 translate-x-1/2`, `top-9 lg:top-10`, `z-[51]`; half sits over main content (wrapper `overflow-visible`).
- Shell: `sticky top-0 z-[50] h-[100vh] max-h-[100vh] self-start overflow-visible` (toggle not clipped; above main column `z-0`).
- Nav wrapper: `flex-1 min-h-0 overflow-hidden`; `<nav>` scrolls with `overflow-y-auto overscroll-contain`.
- Layout row uses `items-start` so the sidebar is not flex-stretched past the viewport.
- Collapsed width `w-28`, aside `px-2`; nav `px-6`. Expanded `w-60` / `lg:w-72`. `border-e` divider; width transition on collapse.

## Dependencies

- [hooks/useProtectedSidebar.md](./hooks/useProtectedSidebar.md)
- `src/assets/images/MLS_Light_Logo.png`, `MLS_Dark_Logo.png`, `favicon.png`

## Navigation

- [ProtectedSidebarNav.md](./ProtectedSidebarNav.md) — sectioned links below logo.

## Notes

- Add items in `protectedSidebarNav.config.ts`.
