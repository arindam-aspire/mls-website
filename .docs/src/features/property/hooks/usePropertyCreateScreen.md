# File Overview

Screen hook for `PropertyCreateScreen`: copy labels and role-aware breadcrumb items.

**Source:** `src/features/property/hooks/usePropertyCreateScreen.ts`

# Responsibilities

- Resolve `propertyList.propertyCreate` strings (title, subtitle, coming soon).
- Build breadcrumb trail: Home → My Listings / Manage Listings (via `resolveListingsMenuPath`) → Create.

# State Management

- Reads `user` from `useAuthStore` for listings path resolution.

# Exports

- `usePropertyCreateScreen()` — returns page copy + `breadcrumbItems` + `breadcrumbAriaLabel`

# Dependencies

- `resolveListingsMenuPath` from `profileMenuRoleAccess.ts`
- `BreadcrumbItem` type from `@/src/components/ui/breadcrumb`
- `common` + `propertyList.propertyCreate` translation keys
