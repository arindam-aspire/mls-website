# Route group `(main)` — `app/[locale]/(main)/`

Primary authenticated-main routes with `ProtectedLayout`. Group name does **not** appear in the URL.

## Layout

[layout.md](./layout.md) → `ProtectedLayout` (protected shell scaffolding).

## Pages

| File | URL | Screen | Guard |
| --- | --- | --- | --- |
| [dashboard/page.md](./dashboard/page.md) | `/en/dashboard` | `DashboardScreen` | `useAuthorize("DASHBOARD")` |
| [my-profile/page.md](./my-profile/page.md) | `/en/my-profile` | `ProfileScreen` | `useAuthorize("PROFILE")` |
| [listing/page.md](./listing/page.md) | `/en/listing` | `ListingPropertyScreen` | `useAuthorize("PROFILE")` |
| [saved-searches/page.md](./saved-searches/page.md) | `/en/saved-searches` | `SavedSearchScreen` | `useAuthorize("SAVED_SEARCHES")` |
| [notifications/page.md](./notifications/page.md) | `/en/notifications` | `NotificationScreen` | `useAuthorize("NOTIFICATIONS")` |
| [favourites/page.md](./favourites/page.md) | `/en/favourites` | `FavouritePropertyScreen` | `useAuthorize("FAVOURITES")` |
| [recently-viewed/page.md](./recently-viewed/page.md) | `/en/recently-viewed` | `RecentlyViewedScreen` | `useAuthorize("RECENTLY_VIEWED")` |

Pages are **client components** that show `LoadingScreen` while auth resolves. `proxy.ts` requires an `access_token` cookie for these paths.

## Architecture

```
/en/*
  layout.tsx (ProtectedLayout)
  dashboard/page.tsx
  my-profile/page.tsx
  listing/page.tsx
  saved-searches/page.tsx
  notifications/page.tsx
  favourites/page.tsx
  recently-viewed/page.tsx
```

## Related

- [property route group](../(property)/README.md)
- [locale layout](../layout.md)
