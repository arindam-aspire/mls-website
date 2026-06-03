# File Overview

`src/layouts/protected-layout/index.tsx` composes the authenticated `(main)` shell: sidebar (md+), header, main content, and footer.

**Source:** `src/layouts/protected-layout/index.tsx`

## Responsibilities

- Provide the root protected layout wrapper.
- Mount `ProtectedSidebar` from `md+` only for **agency** (`admin`) and **agent** roles.
- Render route content through `children` inside `ProtectedMain`.

## Imports

- `ProtectedHeader`
- `ProtectedSidebar`
- `ProtectedMain`
- `ProtectedFooter`
- `ProtectedBottomTabBar`

## Exports

- Default export: `ProtectedLayout`

## State Management

- No state in the composer; child components own their state.

## Navigation

- Mounted by `app/[locale]/(main)/layout.tsx` for locale-prefixed protected routes.

## Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `React.ReactNode` | Page content inside `ProtectedMain` |

## UI Details

- Outer: `flex min-h-dvh items-start`, `bg-page`, `text-text` (`items-start` keeps sidebar at `100vh`).
- Row: sidebar + column (`header` → `main` → `footer`).
- Sidebar hidden below `md`; mobile nav drawer is composed inside `ProtectedHeader` (not in this file).

## Flow Description

1. Full-height flex row renders.
2. Agency/agent users see left sidebar from `md+`; others get full-width column only.
3. Right column stacks header, page `children`, footer.
4. `ProtectedBottomTabBar` fixed at bottom (`md:hidden`).
5. Below `md`, sidebar breakpoint classes do not apply (rail hidden regardless of role).

## Dependencies

- [ProtectedSidebar.md](./ProtectedSidebar.md)
- [ProtectedHeader.md](./ProtectedHeader.md)
- [ProtectedMain.md](./ProtectedMain.md)
- [ProtectedFooter.md](./ProtectedFooter.md)
- `app/[locale]/(main)/layout.tsx`

## Notes

- `ProtectedDrawer` is not wired in this composer. `ProtectedMobileMenu` is mounted from `ProtectedHeader` on small screens.
