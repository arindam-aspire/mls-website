# Route group `(property)` — `app/[locale]/(property)/`

Authenticated user property management routes. Uses same `PublicLayout` as `(main)`.

## Layout

[layout.md](./layout.md) → `PublicLayout`.

## Pages

| File | URL | Screen |
| --- | --- | --- |
| [property-list/page.md](./property-list/page.md) | `/en/property-list` | `PropertyListScreen` |
| [propert-details/[id]/page.md](./propert-details/[id]/page.md) | `/en/propert-details/:id` | `PropertyDetailsScreen` |
| [inquiries/page.md](./inquiries/page.md) | `/en/inquiries` | `InquiriesScreen` |

## Profile menu

All paths linked from `ProfilePopover` (`common` i18n keys).
