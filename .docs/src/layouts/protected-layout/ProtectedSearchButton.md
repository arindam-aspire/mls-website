# File Overview

`lg+` search icon in the protected header; opens the upcoming-feature modal (no navigation).

**Source:** `src/layouts/protected-layout/ProtectedSearchButton.tsx`

# Responsibilities

- Rounded outline `IconButton` with `Search` icon (matches theme/notifications header controls).
- `hidden lg:inline-flex` — not shown below `lg`.
- `aria-label` from `common.searchLabel`.

# Actions

- `onClick` from parent — typically `useProtectedHeader().openSearch` → `UpcomingFeatureModal` with `Search` icon.

# Dependencies

- [ProtectedHeader.md](./ProtectedHeader.md)
