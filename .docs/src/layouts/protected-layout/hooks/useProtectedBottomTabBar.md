# File Overview

Maps all five config tabs when `user` is set; resolves Home path by role; computes active state.

**Source:** `src/layouts/protected-layout/hooks/useProtectedBottomTabBar.ts`

# Exports

- `useProtectedBottomTabBar`
- `ProtectedBottomTabItem`

# Return value

| Key | Description |
| --- | --- |
| `t` | `useTranslations("common")` |
| `tabs` | Filtered items with `label` and `isActive` |
