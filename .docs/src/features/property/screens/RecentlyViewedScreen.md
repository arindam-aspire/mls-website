# File Overview



Recently viewed properties screen: page header with clear action + paginated `PropertyCardList`.



**Source:** `src/features/property/screens/RecentlyViewedScreen.tsx`



# Responsibilities



- Page toolbar: localized `h1`, subtitle, **Clear All** (`tertiary` solid, `Eraser` icon).

- Render `PropertyCardList` from `GET /users/recent-views` (same card/favourite UX as property list and favourites).



# Imports



- `PropertyCardList` from `@abdoun/abdoun-library`

- `ConfirmModal`, `UpcomingFeatureModal`, `Button`

- `useRecentlyViewedScreen`



# Actions / Inputs



| Action | Behavior |

| --- | --- |

| Property card click | Open details in new tab |

| Favourite toggle | `usePropertyFavouriteToggle` (add/remove like property list) |

| Card delete | Opens `ConfirmModal`; on confirm `DELETE /users/recent-views/{propertyHashId}` (`property_hash_id` from list item); `is_delete_loading` on item |

| Clear All | Opens `ConfirmModal`; on confirm `DELETE /users/recent-views` (clear all); refetch list |

| Empty state CTA | Navigate to `/property-list` |



# UI Details



- Header row: stack on mobile; title left, clear button right from `sm:`.

- List: `layoutVariant="grid"`, pagination `10` / `15` / `20`, loading via `PropertyCardList`.

- Delete confirm: `ConfirmModal` (`variant="danger"`, `Trash2` icon, loading state while delete mutation runs).

- Clear confirm: `ConfirmModal` (`confirmColor="tertiary"` solid, tertiary-light icon container, `Eraser` icon, loading state while clear mutation runs).



# Dependencies



- [useRecentlyViewedScreen.md](../hooks/useRecentlyViewedScreen.md)

