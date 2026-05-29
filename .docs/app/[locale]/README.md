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

- `/[locale]/dashboard` — dashboard (Coming Soon)
- `/[locale]/my-profile` — profile (Coming Soon)

### `(property)` — [property documentation](./(property)/README.md)

- `/[locale]/listing`
- `/[locale]/favourites`
- `/[locale]/saved-searches`
- `/[locale]/recently-viewed`
- `/[locale]/inquiries`

Reserved folders (no `page.tsx` yet): `propert-details/`, `property-list/`.

## Auth modal

Auth is **not** a separate route; `AuthModal` opens via query `?auth=<view>` on any page using `PublicLayout`.

## i18n

Messages loaded from `src/messages/<locale>/` in `src/i18n/request.ts`.
