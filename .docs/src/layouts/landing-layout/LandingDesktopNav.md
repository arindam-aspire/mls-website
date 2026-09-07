# File Overview

Landing desktop navigation module.

**Source:** `src/layouts/landing-layout/LandingDesktopNav.tsx`

# Responsibilities

- Render desktop navigation links for landing header (Sell, Rent, About Us).
- Handle locale-aware navigation through `useRouter`.

# Imports

- `useTranslations` from `next-intl`
- `useRouter` from `src/i18n/navigation`
- `cn` from `src/lib/cn`
- `DEFAULT_PROPERTY_LIST_PARAMS` from `src/features/property/utils/parsePropertyListUrlParams`
- `PROPERTY_SEARCH_STATUS_OPTIONS` from `src/features/property/hooks/propertySearchFilter.constants`

# Exports

- `LandingDesktopNav`

# Navigation

- Locale-aware `router.push` from `@/src/i18n/navigation`.

Desktop `NAV_ITEMS` (order):

| Path | Label key | Click destination |
| --- | --- | --- |
| `/sell` | `navSell` | `/property-list?status=buy&category=residential` (existing Buy search defaults from `DEFAULT_PROPERTY_LIST_PARAMS`) |
| `/rent` | `navRent` | `/property-list?status=rent&category=residential` (existing Rent filter from `PROPERTY_SEARCH_STATUS_OPTIONS`, same category default) |
| `/about-us` | `navAboutUs` | `/about-us` |

Sell and Rent reuse the listing route and URL filter params already used by hero search (`pathname: "/property-list"`, `query.status`, `query.category`). About Us is unchanged.

# Flow Description

1. User clicks a desktop header nav button.
2. **Sell** (`navSell`) calls `router.push` with `pathname: "/property-list"` and `query: { status, category }` from `DEFAULT_PROPERTY_LIST_PARAMS` (Buy + residential). `PropertyListScreen` reads those URL params via `parsePropertyListUrlParams` and applies the Buy filter.
3. **Rent** (`navRent`) calls `router.push` with the same listing route and `status` from `PROPERTY_SEARCH_STATUS_OPTIONS` (`rent`) plus the default category. The listing page applies the existing Rent filter.
4. **About Us** still `router.push` `/about-us`.
5. Locale prefix is applied by `@/src/i18n/navigation` (e.g. `/en/property-list?status=rent&category=residential`).

# Notes

- Nav `<button>` elements use `suppressHydrationWarning` because password-manager / autofill extensions often add `fdprocessedid` on the client; landing nav links are a common trigger when `overHero` styles apply.
- This file is now fully implemented in `landing-layout` (no re-export).
