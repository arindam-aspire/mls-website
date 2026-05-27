# File Overview

Landing hero search bar: property category tabs (taxonomy), buy/rent listing type, subtype dropdown, location input, and search navigation to the property list route.

**Source:** `src/features/landing/components/HeroSearchBar.tsx` (Client Component)

# Responsibilities

- Render taxonomy-driven category tabs and dependent subtype options.
- Restrict listing type to `buy` | `rent` (default `buy`).
- On search, navigate to locale-prefixed `/property-list` with query `status` and `category`.

# Imports

- UI: `Button`, `Card`, `Input`, `SelectDropdown`, `Skeleton`, `ButtonGroup`
- `getPropertyCategories`, `PropertyTaxonomyResponse` from landing types
- `useRouter` from `@/src/i18n/navigation`
- `cn` from `@/src/lib/cn`

# Exports

- `HeroSearchBar`

# State Management

- **React** `useState` for `propertyType`, `subtype`, `listingType`, `location`
- **React** `useMemo` / `useEffect` for taxonomy-derived options

# API Usage

_N/A — reads taxonomy via parent (`propertyTaxonomy` prop)._

# Navigation

- **`useRouter`** from `@/src/i18n/navigation`
- Search button: `router.push({ pathname: "/property-list", query: { status: listingType, category: activePropertyType } })` → e.g. `/en/property-list?status=buy&category=<slug>`

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `t` | `(key: string) => string` | next-intl translator for `home` keys |
| `theme` | `string` | Tab styling (`dark` vs light hero) |
| `isLoading` | `boolean` | Show skeleton |
| `propertyTaxonomy` | optional taxonomy response | Category / subtype data |

# Actions / Inputs

## Inputs

- Category tabs (property type slug)
- Listing type select (`buy` | `rent`)
- Subtype select (taxonomy `property_types` ids)
- Location text field

## Actions

- **Search** — navigates to property list with `status` + `category` query params
- Change property type tab — resets subtype
- Change listing type — updates `listingType`

## Validations

_No form submit validation yet (navigation only)._

## Show/Hide Controls

_N/A._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards; tabs use project button-group patterns.
- **Responsive:** mobile-first grid (`md:grid-cols-4`).

# Flow Description

1. Parent passes taxonomy + loading; skeleton shows while loading.
2. User picks category tab → `activePropertyType` drives subtype options.
3. User picks buy/rent (default buy).
4. User clicks Search → `router.push` to `/[locale]/property-list?status=…&category=…`.

# Dependencies

- [HeroSection.md](./HeroSection.md) (typical parent)
- [property-list page.md](../../../../app/[locale]/(property)/property-list/page.md)

# Notes

- `category` is the selected category **slug** (`activePropertyType`), matching taxonomy `PropertyCategory.slug`.
- `status` is `buy` or `rent` (listing type).
- Keep in sync when `src/features/landing/components/HeroSearchBar.tsx` changes.
