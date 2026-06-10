# File Overview

Maps bottom tabs when `user` is set; resolves Home and Listings paths by role; computes active state.

**Source:** `src/layouts/protected-layout/hooks/useProtectedBottomTabBar.ts`

# Exports

- `useProtectedBottomTabBar`
- `ProtectedBottomTabItem`

# Return value

| Key | Description |
| --- | --- |
| `t` | `useTranslations("common")` |
| `tabs` | Items with `label` and `isActive`; Listings tab omitted when user has no listing access; agency/agent → `/manage-listings` + `manageListings` label; owner → `/my-listings` + `protectedTabListings` |
