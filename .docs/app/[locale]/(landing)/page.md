# File Overview

Locale-prefixed landing page entrypoint.

**Source:** `app/[locale]/(landing)/page.tsx`

# Responsibilities

- Render `LandingScreen` for `/[locale]`.
- Keep page file thin and route-focused.

# Imports

- `LandingScreen` from `src/features/landing/screens/LandingScreen`

# Exports

- `HomePage`
- `default`

# State Management

_No local state in page file._

# Navigation

- Served at `/<locale>` because `(landing)` is a route group.

# Flow Description

1. User visits locale root path like `/en`.
2. App Router resolves `(landing)/page.tsx`.
3. `LandingScreen` renders hero and marketing sections.

# Notes

- Keep in sync when `app/[locale]/(landing)/page.tsx` changes.
