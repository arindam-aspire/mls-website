# File Overview

Favourites route screen: paginated favorite properties via `PropertyListingCardList` (no filters).

**Source:** `src/features/property/screens/FavouritePropertyScreen.tsx`

# Responsibilities

- Compose `PropertyListingCardList` with data from `useFavouritePropertyList`.
- No filter bar (unlike `PropertyListScreen`).
- Contact actions via `usePropertyContactModalActions` (agent email/phone).

# Imports

- `PropertyListingCardList` from `../components/PropertyListingCardList`
- `useFavouritePropertyList` from `../hooks/useFavouritePropertyList`
- `ContactModal` from `@/src/features/contact/components/ContactModal`

# API Usage

Delegated to [useFavouritePropertyList.md](../hooks/useFavouritePropertyList.md) → `GET /favorites`.

# Navigation

- Mounted at `/en/favourites` via `app/[locale]/(main)/favourites/page.tsx` (`ProtectedLayout`, `useAuthorize("PROFILE")`).

# Flow Description

1. Hook fetches favorites for current page/page size.
2. Mapper converts nested `property` items to `PropertyListing`.
3. `PropertyListingCardList` renders **grid-only** cards with pagination (no toolbar); owners hidden; agency/agent names shown when present.
4. Empty state copy via `propertyList.favourites` (`noDataTitle`, `noDataDescription`, `noDataAction`). **Browse properties** navigates to `/property-list`.

# Dependencies

- [useFavouritePropertyList.md](../hooks/useFavouritePropertyList.md)
- [favoriteList.mapper.md](../mappers/favoriteList.mapper.md)
