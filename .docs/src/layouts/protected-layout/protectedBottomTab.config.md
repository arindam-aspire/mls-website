# File Overview

Fixed five bottom tabs for `ProtectedBottomTabBar` (no per-tab permission filter).

**Source:** `src/layouts/protected-layout/protectedBottomTab.config.ts`

# Tab order

1. Home → `/dashboard` (or `/my-profile` when user lacks `DASHBOARD` — resolved in hook)
2. Listings → `/listing`
3. Search → `/property-list`
4. Favourites → `/favourites`
5. Enquiry → `/inquiries`

# Exports

- `PROTECTED_BOTTOM_TAB_ITEMS`
- `ProtectedBottomTabItemConfig`, `ProtectedBottomTabLabelKey`
