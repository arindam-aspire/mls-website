# File Overview

Builds filtered, localized sidebar nav sections for the current user.

**Source:** `src/layouts/protected-layout/hooks/useProtectedSidebarNav.ts`

# Exports

- `useProtectedSidebarNav` → `{ sections }`

# Section item shape

Each item includes `label`, `isActive`, `href`, `icon`, and permission metadata from config.

# Dependencies

- `useAuthStore`, `hasPermission`, `usePathname`, `PROTECTED_SIDEBAR_NAV_SECTIONS`
