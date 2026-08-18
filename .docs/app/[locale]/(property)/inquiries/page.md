# File Overview

Next.js App Router page for locale-prefixed My Inquiries. Owners receive the owner-scoped Lead List; other authenticated roles retain the existing Coming Soon view.

**Source:** `app/[locale]/(property)/inquiries/page.tsx`

# Responsibilities

- Next.js App Router page for route segment `[locale]/inquiries`. Thin wrapper that renders a feature screen.

# Imports

- `import InquiriesScreen from "@/src/features/property/screens/InquiriesScreen"`

# Exports

- `InquiriesPage`
- `default`

# State Management

_No significant state; presentational or config module._

# API Usage

The child screen calls `GET /agency/owners/{loggedInUser.id}/leads`.

# Navigation

- URL examples: `/en/inquiries`, `/ar/inquiries`.
- `proxy.ts` requires an access-token cookie; `InquiriesScreen` branches on the hydrated role.

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

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

1. Next.js resolves locale-prefixed URL.
2. Middleware rejects unauthenticated access.
3. The page renders `InquiriesScreen`.
4. The screen loads only the logged-in owner’s enquiries for Owner; other authenticated roles do not call the owner API.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `app/[locale]/(property)/inquiries/page.tsx` changes.
