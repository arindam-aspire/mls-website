# File Overview

App-local status badge for property listing tables. Mirrors `@abdoun/abdoun-library` `ListingStatusBadge` layout but uses MLS-specific status colors from `propertyListingStatusBadgeColors.ts`.

**Source:** `src/features/property/components/PropertyListingStatusBadge.tsx`

# Responsibilities

- Render a soft pill badge with `status.label`.
- Resolve badge colors via `getPropertyListingStatusBadgeClassName(status.key)` (case-insensitive key normalization).

# Props / Parameters

| Prop | Type |
| --- | --- |
| `status` | `PropertyListingStatus` — `{ key, label }` from listing mappers |

# UI Details

- `rounded-full` pill, `border backdrop-blur-sm`, responsive text sizing (`text-[11px] sm:text-xs`).
- Per-status palette: gray, blue, indigo, amber, green, red, orange, teal, purple, cyan.
- Light and dark theme variants on each palette.

# Dependencies

- [propertyListingStatusBadgeColors.md](../utils/propertyListingStatusBadgeColors.md)
- [buildMyListingTableColumns.md](../utils/buildMyListingTableColumns.md)
