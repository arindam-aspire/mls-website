# Landing feature (`src/features/landing/`)

Home page experience: full-screen hero with property taxonomy search, and marketing “details” section.

## Architecture

```
landing/
  screens/LandingScreen.tsx     Orchestrates hero + details
  components/                   HeroSection, HeroSearchBar, DetailsSection
  query/landing.query.ts        usePropertyTaxonomy
  services/landing.service.ts   GET /property-taxonomy
  types/propertyTaxonomy.types.ts
```

## Data flow

1. `LandingScreen` calls `usePropertyTaxonomy()`.
2. Query → `landing.service` → `publicEndpoints.CATEGORY_PROPERTY_LIST`.
3. Taxonomy passed to `HeroSection` / `HeroSearchBar` for filters.
4. Errors surfaced via `useToast`.

## Route

- `/en/` (and other locales) — `app/[locale]/(main)/page.tsx` → `LandingScreen`.

## Subfolders

| Folder | README |
| --- | --- |
| [screens/](./screens/README.md) | `LandingScreen` |
| [components/](./components/README.md) | Hero UI |
| [query/](./query/README.md) | React Query hook |
| [services/](./services/README.md) | Public API |
| [types/](./types/README.md) | Taxonomy types |

## UI

- Hero uses `text-hero-on-image` on image overlay; theme-aware logos in header (see `PublicHeader`).
- i18n namespace: `home` (`src/messages/*/home.json`).
