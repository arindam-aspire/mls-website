# File Overview

Sectioned navigation list inside `ProtectedSidebar`.

**Source:** `src/layouts/protected-layout/ProtectedSidebarNav.tsx`

# Responsibilities

- Render nav sections and links from `protectedSidebarNav.config.ts`.
- Filter items with `hasPermission`.
- Highlight active route via `usePathname`.
- Collapsed: icon-only + `title` tooltip; expanded: section title + label.
- Scroll: `flex-1 min-h-0 overflow-y-auto` on `<nav>`; parent aside is `overflow-hidden`.

# UI Details

- Default item: no background, `text-muted`.
- Hover: `bg-inherit-color/10`, `text-text`.
- Active item: `bg-primary text-white`.
- Section heading: uppercase `text-xs text-muted` (hidden when collapsed).
- Section list gap: `gap-6` expanded, `gap-2` when collapsed.

# Dependencies

- [hooks/useProtectedSidebarNav.md](./hooks/useProtectedSidebarNav.md)
- [protectedSidebarNav.config.md](./protectedSidebarNav.config.md)
