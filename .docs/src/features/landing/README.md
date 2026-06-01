# Landing feature (`src/features/landing/`)

Home page experience: full-screen hero with property taxonomy search, and marketing “details” section.

## Architecture

```
landing/
  screens/LandingScreen.tsx     Orchestrates hero + details
  components/                   HeroSection, HeroSearchBar, DetailsSection
  mutations/landing.mutation.ts useGetPropertyTaxonomy, useGetLocationTaxonomy
  services/landing.service.ts   GET /property-taxonomy
  types/propertyTaxonomy.types.ts
```

## Data flow

1. `LandingScreen` calls `useGetPropertyTaxonomy().mutate()` and `useGetLocationTaxonomy().mutate()` when not cached in `usePropertyStore`.
2. Mutation → `landing.service` → `publicEndpoints.CATEGORY_PROPERTY_LIST`.
3. On success, taxonomy is persisted in `property.store`.
4. Taxonomy passed to `HeroSection` / `HeroSearchBar` for filters.
5. Errors surfaced via `useToast`.

## Route

- `/en/` (and other locales) — `app/[locale]/(landing)/page.tsx` → `LandingScreen`.

## Subfolders

| Folder | README |
| --- | --- |
| [screens/](./screens/README.md) | `LandingScreen` |
| [components/](./components/README.md) | Hero UI |
| [mutations/](./mutations/README.md) | React Query mutation hook |
| [services/](./services/README.md) | Public API |
| [types/](./types/README.md) | Taxonomy types |

## UI

- Hero uses `text-hero-on-image` on image overlay; theme-aware logos in header (see `PublicHeader`).
- i18n namespace: `home` (`src/messages/*/home.json`).
