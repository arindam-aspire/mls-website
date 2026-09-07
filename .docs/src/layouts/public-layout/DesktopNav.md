# File Overview

Project source module.

**Source:** `src/layouts/public-layout/DesktopNav.tsx` (Client Component)

# Responsibilities

- Project source module.
- Render desktop nav links (Sell, Rent, About Us) with standard public-layout styling.

# Imports

- `import { cn } from "@/src/lib/cn"`
- `import { useRouter } from "@/src/i18n/navigation"`
- `import { DEFAULT_PROPERTY_LIST_PARAMS } from "@/src/features/property/utils/parsePropertyListUrlParams"`
- `import { PROPERTY_SEARCH_STATUS_OPTIONS } from "@/src/features/property/hooks/propertySearchFilter.constants"`

# Exports

- `DesktopNav`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Use **`Link`**, **`useRouter`**, **`redirect`** from `@/src/i18n/navigation` for locale-prefixed paths (e.g. `/en/listing`).

Desktop `NAV_ITEMS` (order):

| Path | Label key | Click destination |
| --- | --- | --- |
| `/sell` | `navSell` | `/property-list?status=buy&category=residential` (existing Buy search defaults from `DEFAULT_PROPERTY_LIST_PARAMS`) |
| `/rent` | `navRent` | `/property-list?status=rent&category=residential` (existing Rent filter from `PROPERTY_SEARCH_STATUS_OPTIONS`, same category default) |
| `/about-us` | `navAboutUs` | `/about-us` |

Sell and Rent reuse the listing route and URL filter params already used by hero search (`pathname: "/property-list"`, `query.status`, `query.category`). About Us is unchanged.

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

- **Sell:** navigate to `/property-list` with existing Buy filter query (`status=buy`, `category=residential`).
- **Rent:** navigate to `/property-list` with existing Rent filter query (`status=rent`, `category=residential`).
- **About Us:** navigate to `/about-us`.

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

1. User clicks a desktop header nav button.
2. **Sell** (`navSell`) calls `router.push` with `pathname: "/property-list"` and `query: { status, category }` from `DEFAULT_PROPERTY_LIST_PARAMS` (Buy + residential). `PropertyListScreen` reads those URL params via `parsePropertyListUrlParams` and applies the Buy filter.
3. **Rent** (`navRent`) calls `router.push` with the same listing route and `status` from `PROPERTY_SEARCH_STATUS_OPTIONS` (`rent`) plus the default category. The listing page applies the existing Rent filter.
4. **About Us** still `router.push` `/about-us`.
5. Locale prefix is applied by `@/src/i18n/navigation` (e.g. `/en/property-list?status=rent&category=residential`).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Landing-specific visual treatment now lives in `src/layouts/landing-layout/LandingDesktopNav.tsx`.
- Keep in sync when `src/layouts/public-layout/DesktopNav.tsx` changes.
