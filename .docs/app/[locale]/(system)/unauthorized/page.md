# File Overview

`app/[locale]/(system)/unauthorized/page.tsx` renders the locale-aware 401 unauthorized page.

**Source:** `app/[locale]/(system)/unauthorized/page.tsx`

## Responsibilities

- Render `UnauthorizedScreen` inside `(system)` layout (`PublicLayout`).

## Imports

- `UnauthorizedScreen` from `src/features/unauthorized/screens/UnauthorizedScreen`

## Exports

- `UnauthorizedPage` (default)

## Navigation

- Locale-aware URL: `/en/unauthorized`, `/ar/unauthorized`, etc.
- `useAuthorize` redirects here when permission check fails.

## Flow Description

1. Route resolves to unauthorized page under `(system)` group.
2. `(system)/layout.tsx` applies `PublicLayout`.
3. `UnauthorizedScreen` displays 401 UI.

## Dependencies

- `src/features/unauthorized/screens/UnauthorizedScreen.tsx`
- [../layout.md](../layout.md)
