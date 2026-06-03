# File Overview

Catch-all route under `[locale]` for unknown path segments.

**Source:** `app/[locale]/[...rest]/page.tsx`

# Responsibilities

- Match any unmatched locale-prefixed path.
- Call `notFound()` so Next.js renders `app/[locale]/not-found.tsx` → `NotFoundScreen`.

# Imports

- `notFound` from `next/navigation`

# Exports

- `default` (calls `notFound()`)

# Navigation

- Example: `/en/unknown-path` triggers 404 flow with locale intact.

# Flow Description

1. Request hits `[...rest]` segment.
2. Page invokes `notFound()`.
3. Locale `not-found.tsx` renders `NotFoundScreen` inside layout chain.

# Dependencies

- `app/[locale]/not-found.tsx`
- `src/features/not-found/screens/NotFoundScreen.tsx`

# Notes

- Does not render a dedicated screen component directly.
