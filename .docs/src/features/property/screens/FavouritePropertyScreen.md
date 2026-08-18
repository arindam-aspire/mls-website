# File Overview

Favourites route screen: paginated favorite properties via `PropertyCardList` (no filters).

**Source:** `src/features/property/screens/FavouritePropertyScreen.tsx`

# Responsibilities

- Compose `PropertyCardList` from `@abdoun/abdoun-library` with data from `useFavouritePropertyList`.
- No filter bar (unlike `PropertyListScreen`).
- `UpcomingFeatureModal` for contact/favourite actions not yet wired to API.

# Imports

- `PropertyCardList` from `@abdoun/abdoun-library`
- `useFavouritePropertyList` from `../hooks/useFavouritePropertyList`
- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`

# API Usage

Delegated to [useFavouritePropertyList.md](../hooks/useFavouritePropertyList.md) → `GET /favorites`.

# Navigation

- Mounted at `/en/favourites` via `app/[locale]/(main)/favourites/page.tsx` (`ProtectedLayout`, `useAuthorize("PROFILE")`).

# Flow Description

1. Hook fetches favorites for current page/page size.
2. Mapper converts nested `property` items to `PropertyListing`.
3. `PropertyCardList` renders **grid-only** cards with pagination (no toolbar); `canViewAgents={false}` (same as property list / recently viewed).
4. Empty state copy via `propertyList.favourites` (`noDataTitle`, `noDataDescription`, `noDataAction`). **Browse properties** navigates to `/property-list`.

# Dependencies

- [useFavouritePropertyList.md](../hooks/useFavouritePropertyList.md)
- [favoriteList.mapper.md](../mappers/favoriteList.mapper.md)
