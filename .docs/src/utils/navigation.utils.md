# File Overview

Imperative navigation helpers used outside React event handlers (auth mutations, Axios 401 handling).

**Source:** `src/utils/navigation.utils.ts`

# Responsibilities

- Hold a module-level reference to the Next.js App Router instance set by [NavigationInitializer.md](../initializers/NavigationInitializer.md).
- Run [navigationGuard.md](../navigation/navigationGuard.md) interceptors before `push` / `replace` / `back`.
- Keep the locale prefix on the href passed to `next/navigation` (`/en/dashboard`). The initializer lives in the root layout, outside `NextIntlClientProvider`, so it cannot use next-intl's router. Stripping `/en` would send `/dashboard`, which Next treats as `locale="dashboard"` and renders the catch-all 404 page.

# Imports

- `AppRouterInstance` from `next/dist/shared/lib/app-router-context.shared-runtime`
- `routing` / `AppLocale` from `@/src/i18n/routing`
- `stripLocalePrefixFromPath` from `@/src/i18n/stripLocalePrefixFromPath` (interceptor href only)
- `runNavigationInterceptors` from `@/src/navigation/navigationGuard`

# Exports

| Export | Purpose |
| --- | --- |
| `initializeNavigation` | Store the router instance from `NavigationInitializer` |
| `navigateTo` | `router.push` after interceptors |
| `navigateReplace` | `router.replace` after interceptors |
| `navigateBack` | `router.back` after interceptors |

# State Management

Module-level `navigateRef`. Not Zustand or React Query.

# API Usage

_N/A._

# Navigation

Callers should pass locale-prefixed paths when targeting App Router pages:

| Caller | Href |
| --- | --- |
| Agent/agency sign-in (`completeSignInFlow`) | `/${locale}/dashboard` |
| `requires_password_set` | `/${locale}/set-new-password` |
| Logout | `/${locale}` |
| Axios 401 | `/` (root page redirects into the locale) |

If a path has no locale segment (for example `/dashboard`), `toNextNavigationHref` prefixes the current `window.location` locale so the native router still matches `app/[locale]/...`.

Interceptors still receive the **stripped** path (`/dashboard`) so unsaved-change guards can compare locale-free hrefs.

# Props / Parameters

| Function | Arguments |
| --- | --- |
| `initializeNavigation` | `router: AppRouterInstance` |
| `navigateTo` / `navigateReplace` | `path: string` |
| `navigateBack` | none |

# Actions / Inputs

## Inputs

- Destination path strings from auth and HTTP layers.

## Actions

- Push, replace, or back after interceptors allow the navigation.
- If the router is not registered yet, `navigateTo` / `navigateReplace` fall back to `window.location.href` using the locale-prefixed href.

## Validations

_N/A._

## Show/Hide Controls

_N/A._

# UI Details

_N/A._

# Flow Description

1. `NavigationInitializer` calls `initializeNavigation(useRouter())` from `next/navigation`.
2. `navigateTo("/en/dashboard")` strips locale for interceptors only (`/dashboard`).
3. The App Router receives `/en/dashboard` and matches `app/[locale]/(main)/dashboard/page.tsx`.
4. If interceptors return `false`, navigation is cancelled (unsaved-changes guard).

# Dependencies

- [NavigationInitializer.md](../initializers/NavigationInitializer.md)
- [stripLocalePrefixFromPath.md](../i18n/stripLocalePrefixFromPath.md)
- [navigationGuard.md](../navigation/navigationGuard.md)
- [auth.mutation.md](../features/auth/mutations/auth.mutation.md)

# Notes

- Do not strip the locale before `router.push` / `router.replace` on this native router. next-intl `useRouter` in feature code still strips prefixes in [navigation.md](../i18n/navigation.md).
