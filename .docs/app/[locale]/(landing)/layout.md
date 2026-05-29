# File Overview

Next.js route-group layout for landing routes under `app/[locale]/(landing)/`.

**Source:** `app/[locale]/(landing)/layout.tsx`

# Responsibilities

- Wrap landing route children with `LandingLayout`.
- Keep landing route chrome isolated from other route groups.

# Imports

- `LandingLayout` from `src/layouts/landing-layout`

# Exports

- `MainLayout`
- `default`

# State Management

_No local state in this layout._

# Navigation

- Route group `(landing)` does not appear in URL.
- Applies to locale-prefixed root route like `/en`.

# Props / Parameters

- `children: React.ReactNode`

# Flow Description

1. App Router resolves a page inside `(landing)`.
2. This layout wraps children with `LandingLayout`.
3. `LandingLayout` renders landing header, auth modal, main, and footer.

# Notes

- Keep in sync when `app/[locale]/(landing)/layout.tsx` changes.
