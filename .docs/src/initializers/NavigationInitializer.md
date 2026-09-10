# File Overview

Registers the App Router instance so non-React code can navigate (sign-in redirect, logout, Axios 401).

**Source:** `src/initializers/NavigationInitializer.tsx` (Client Component)

**Where used:** Root [layout.md](../../app/layout.md), inside `AuthProvider`.

# Responsibilities

- Call `useRouter()` from `next/navigation` (not next-intl). This component sits in the root layout, **outside** `NextIntlClientProvider` in `app/[locale]/layout.tsx`.
- Pass that router to `initializeNavigation` so `navigateTo` / `navigateReplace` / `navigateBack` work.

# Imports

- `useRouter` from `next/navigation`
- `initializeNavigation` from `@/src/utils/navigation.utils`

# Exports

- `NavigationInitializer`

# State Management

_No local state._ The router reference is stored in `navigation.utils`.

# API Usage

_N/A._

# Navigation

Does not navigate itself. After registration, auth mutations call `navigateTo(\`/${locale}/dashboard\`)` for agents and agency admins. That path **must keep** the locale prefix because this initializer uses the native App Router.

# Props / Parameters

None.

# Actions / Inputs

## Inputs

_N/A._

## Actions

On mount (and when the router identity changes), store the router on the navigation module.

## Validations

_N/A._

## Show/Hide Controls

Renders `null`.

# UI Details

_N/A — no UI._

# Flow Description

1. Root layout renders `NavigationInitializer` under providers.
2. `useEffect` calls `initializeNavigation(router)`.
3. Later, `completeSignInFlow` can `navigateTo("/en/dashboard")` without importing React hooks.

# Dependencies

- [layout.md](../../app/layout.md)
- [navigation.utils.md](../utils/navigation.utils.md)

# Notes

- Feature UI should keep using `useRouter` from `@/src/i18n/navigation`.
- Keep in sync when `src/initializers/NavigationInitializer.tsx` changes.
