# File Overview

`app/[locale]/(system)/layout.tsx` wraps all `(system)` route-group pages with `PublicLayout`.

**Source:** `app/[locale]/(system)/layout.tsx`

## Responsibilities

- Provide shared chrome (header, footer, auth modal shell) for system routes such as unauthorized.

## Imports

- `PublicLayout` from `src/layouts/public-layout`

## Exports

- `SystemLayout` (default)

## Flow Description

1. Next.js applies this layout for routes under `(system)/`.
2. Child segments (e.g. `unauthorized/page.tsx`) render inside `PublicLayout`.

## Dependencies

- [README.md](./README.md)
- [unauthorized/page.md](./unauthorized/page.md)
- `src/layouts/public-layout/index.tsx`
