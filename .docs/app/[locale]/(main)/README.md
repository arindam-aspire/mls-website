# Route group `(main)` — `app/[locale]/(main)/`

Primary authenticated-main routes with `ProtectedLayout`. Group name does **not** appear in the URL.

## Layout

[layout.md](./layout.md) → `ProtectedLayout` (protected shell scaffolding).

## Pages

| File | URL | Screen | Guard |
| --- | --- | --- | --- |
| [dashboard/page.md](./dashboard/page.md) | `/en/dashboard` | `DashboardScreen` | `useAuthorize("DASHBOARD")` |
| [(listings)/my-listings/page.md](./(listings)/my-listings/page.md) | `/en/my-listings` | `ListingPropertyScreen` | `useAuthorize("MY_LISTINGS")` |
| [(listings)/manage-listings/page.md](./(listings)/manage-listings/page.md) | `/en/manage-listings` | `ManageListingsScreen` | `useAuthorize("MANAGE_LISTINGS")` |
| [(profile)/my-profile/page.md](./(profile)/my-profile/page.md) | `/en/my-profile` | `ProfileScreen` | `useAuthorize("PROFILE")` |
| [(profile)/agency-settings/page.md](./(profile)/agency-settings/page.md) | `/en/agency-settings` | `AgencySettingsScreen` | `useAuthorize("AGENCY_SETTINGS")` |
| [(profile)/notification-settings/page.md](./(profile)/notification-settings/page.md) | `/en/notification-settings` | `NotificationSettingsScreen` | `useAuthorize("NOTIFICATION_SETTINGS")` |
| [saved-searches/page.md](./saved-searches/page.md) | `/en/saved-searches` | `SavedSearchScreen` | `useAuthorize("SAVED_SEARCHES")` |
| [notifications/page.md](./notifications/page.md) | `/en/notifications` | `NotificationScreen` | `useAuthorize("NOTIFICATIONS")` |
| [favourites/page.md](./favourites/page.md) | `/en/favourites` | `FavouritePropertyScreen` | `useAuthorize("FAVOURITES")` |
| [recently-viewed/page.md](./recently-viewed/page.md) | `/en/recently-viewed` | `RecentlyViewedScreen` | `useAuthorize("RECENTLY_VIEWED")` |

Pages are **client components** that show `LoadingScreen` while auth resolves. `proxy.ts` requires an `access_token` cookie for these paths.

## Architecture

```
/en/*
  layout.tsx (ProtectedLayout)
  (listings)/
    my-listings/page.tsx
    manage-listings/page.tsx
  (profile)/
    my-profile/page.tsx
    agency-settings/page.tsx
    notification-settings/page.tsx
  dashboard/page.tsx
  saved-searches/page.tsx
  notifications/page.tsx
  favourites/page.tsx
  recently-viewed/page.tsx
```

## Related

- [(listings) route group](./(listings)/README.md)
- [property route group](../(property)/README.md)
- [locale layout](../layout.md)
