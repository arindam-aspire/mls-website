# File Overview

Route-level property list screen. Renders `PropertyCardList` from `@abdoun/abdoun-library`; all logic lives in `usePropertyList`.

**Source:** `src/features/property/screens/PropertyListScreen.tsx`

# Responsibilities

- Compose `PropertyListFilters` (top) and `PropertyCardList` with data and handlers from `usePropertyList`.
- Display loading, toolbar, pagination, and empty states via the library component.

# Imports

- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`
- `PropertyListFilters` from `../components/PropertyListFilters`
- `PropertyCardList` from `@abdoun/abdoun-library`
- `usePropertyList` from `../hooks/usePropertyList`

# Exports

- `PropertyListScreen` (default)

# State Management

_Delegated to [usePropertyList](../hooks/usePropertyList.md)._

# API Usage

_Delegated to hook → `GET /properties` and property taxonomy (when not cached in store)._

# Navigation

- Route: `/en/property-list` with full query string (`page`, `pageSize`, `category`, `status`, `sort`, `type`, `location`, and optional advanced filters).
- Card click opens `/en/propert-details/:id` in a **new tab** (locale-prefixed via `getPathname`).

# Props / Parameters

_No props._

# Actions / Inputs

| User action | Handler (from hook) |
| --- | --- |
| Status / category / type | `filters.onStatusChange`, `onCategoryChange`, `onTypeChange` |
| Advance / Save search / Favourite / Email / Call / WhatsApp | Opens `UpcomingFeatureModal` |
| Sort change | `toolbar.onSortChange` |
| Grid/list toggle | `toolbar.onViewChange` |
| Page change | `pagination.onPageChange` |
| Page size change | `pagination.onPageSizeChange` |
| Card click | `onClick` → property details (new tab) |

# UI Details

- **Sticky filters:** full-width bar (`-mx-6 px-6`) sticks at `top-[var(--layout-header-height)]` below `PublicHeader`; filters sit in `container mx-auto`; list content in a separate container below
- **Scroll:** document-level scroll (see `PublicMain` property-list branch and root `html min-h-full`) — required for sticky to engage
- **Library:** `@abdoun/abdoun-library` styles imported in `app/globals.css`
- **Theme:** library + app semantic tokens
- **Responsive:** `PropertyCardList` grid/list layouts

# Flow Description

1. Screen calls `usePropertyList()`.
2. Renders `PropertyListFilters` with `{...filters}` from the hook.
3. Renders `UpcomingFeatureModal` when Save Search, Email, Call, WhatsApp, or Favourite is clicked (Advance Search toggles the inline advanced filter panel).
4. Renders `PropertyCardList` with listings and callbacks.

# Dependencies

- [../components/PropertyListFilters.md](../components/PropertyListFilters.md)
- [../hooks/usePropertyList.md](../hooks/usePropertyList.md)
- `@abdoun/abdoun-library` (`PropertyCardList`)

# Notes

- Sort is synced to the API via `sort` query param; changing sort resets page to 1.
