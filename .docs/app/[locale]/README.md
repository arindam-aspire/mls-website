# `app/[locale]/` — Localized routes

Dynamic segment `[locale]` must be one of `en`, `ar`, `es`, `fr`.

## Files

| File | Role |
| --- | --- |
| `layout.tsx` | Validates locale, `setRequestLocale`, loads messages |
| `not-found.tsx` | Locale-aware 404 |
| `[...rest]/page.tsx` | Catch-all |

## Route groups

### `(landing)` — [landing documentation](./(landing)/README.md)

- `/[locale]/` — home (`LandingScreen`)

### `(main)` — [main documentation](./(main)/README.md)

- `/[locale]/dashboard` — dashboard (`useAuthorize("DASHBOARD")`, Coming Soon screen)
- `/[locale]/manage-listings` — manage listings (`useAuthorize("MANAGE_LISTINGS")`, `ManageListingsScreen`)
- `/[locale]/my-profile` — profile (`useAuthorize("PROFILE")`)
- `/[locale]/my-listings` — my listings (`useAuthorize("MY_LISTINGS")`, `ListingPropertyScreen`)
- `/[locale]/saved-searches` — saved searches (`useAuthorize("SAVED_SEARCHES")`, `SavedSearchScreen`)
- `/[locale]/notifications` — notifications (`useAuthorize("NOTIFICATIONS")`, `NotificationScreen`)
- `/[locale]/favourites` — favourites (`useAuthorize("FAVOURITES")`, `FavouritePropertyScreen`)
- `/[locale]/recently-viewed` — recently viewed (`useAuthorize("RECENTLY_VIEWED")`, `RecentlyViewedScreen`)

### `(property)` — [property documentation](./(property)/README.md)

- `/[locale]/property-list` — property search list
- `/[locale]/propert-details/:id` — property detail
- `/[locale]/inquiries`

Reserved folders (no `page.tsx` yet): none under `(property)/`.

### `(system)` — [system documentation](./(system)/README.md)

- Layout: `PublicLayout` via `(system)/layout.tsx`
- `/[locale]/unauthorized` — 401 unauthorized (`UnauthorizedScreen`)

## Auth modal

Auth is **not** a separate route; `AuthModal` opens via query `?auth=<view>` on any page using `PublicLayout`.

## i18n

Messages loaded from `src/messages/<locale>/` in `src/i18n/request.ts`.
