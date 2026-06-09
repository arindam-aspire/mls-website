# File Overview

Client hook for the favourites screen: fetches paginated favorites, maps to library list shape, toolbar/pagination, and card actions.

**Source:** `src/features/property/hooks/useFavouritePropertyList.ts`

# Responsibilities

- `GET /favorites?page=&pageSize=` via `useGetFavoriteList` (auth required).
- Local `page` / `pageSize` state (no URL search params).
- Map response with `mapFavoriteListResponse` → `PropertyListing[]`.
- Expose `pageTitle`, `pageSubtitle`, `PropertyCardList` props: `listings`, `pagination`, `noDataFound`, handlers (no toolbar; grid layout only in screen).
- `cardButtonSize`: `"md"` for `registered_user` / `owner`; `"sm"` for other roles (`canTrackRecentPropertyView`).
- Contact actions open `UpcomingFeatureModal`.
- **Heart icon** calls `DELETE /favorites/:propertyHash` via `useRemoveFavorite`, then refetches the list.

# API Usage

| Call | Endpoint |
| --- | --- |
| `getFavoriteList` | `GET /favorites` |

# State Management

Local React state for listings, pagination meta, layout variant, and modal visibility.

# Navigation

- Property card click → opens `/propert-details/:id` in new tab (locale-aware).

# Dependencies

- [FavouritePropertyScreen.md](../screens/FavouritePropertyScreen.md)
- [favoriteList.mapper.md](../mappers/favoriteList.mapper.md)
- [property.mutation.md](../mutations/property.mutation.md)

# i18n

`useTranslations("propertyList.favourites")` — list title, empty state, fetch error toast.
