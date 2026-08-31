# File Overview

Route-level property list screen. Renders `PropertyListingCardList` (library Grid/List cards); all logic lives in `usePropertyList`.

**Source:** `src/features/property/screens/PropertyListScreen.tsx`

# Responsibilities

- Compose `PropertyListFilters` (top) and `PropertyListingCardList` with data and handlers from `usePropertyList`.
- Display loading, toolbar, pagination, and empty states via the library component.

# Imports

- `PropertyListFilters` from `../components/PropertyListFilters`
- `PropertyListingCardList` from `../components/PropertyListingCardList`
- `usePropertyList` from `../hooks/usePropertyList`
- `ContactModal`, `SaveSearchModal`

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
| Save search | Guest → `AuthModal` (`chooseAccount`); signed-in → `SaveSearchModal` with `SaveSearchForm` |
| Favourite / Email / Call / WhatsApp | Agent contact: Email → `mailto:`; Call → `ContactModal`; WhatsApp → `wa.me`. Guest without agent → auth modal. |
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
3. Renders `SaveSearchModal` when Save Search is used. Email / Call / WhatsApp use agent contact handlers (Advance Search toggles the inline advanced filter panel).
4. Renders `PropertyListingCardList` with listings and callbacks (owners hidden; agency/agent names shown when present; Email/Call/WhatsApp use listing `cardContact` / agent).

# Dependencies

- [../components/PropertyListFilters.md](../components/PropertyListFilters.md)
- [../components/PropertyListingCardList.md](../components/PropertyListingCardList.md)
- [../hooks/usePropertyList.md](../hooks/usePropertyList.md)
- `@abdoun/abdoun-library` (`PropertyCardList` via the MLS wrapper)

# Notes

- Sort is synced to the API via `sort` query param; changing sort resets page to 1.
- Agent/agency names show on cards when the API provides them; owner chips are hidden on Grid and List.
- Card Email opens the default mail client (`mailto:` agent email). Call shows agent contact in `ContactModal`. WhatsApp opens `wa.me` with the agent phone.
