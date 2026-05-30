# File Overview

Next.js App Router page for dynamic route `[locale]/propert-details/[id]`. Thin wrapper that renders `PropertyDetailsScreen` with the URL property id.

**Source:** `app/[locale]/(property)/propert-details/[id]/page.tsx`

# Responsibilities

- Resolve dynamic `id` segment from the URL.
- Set route metadata title to `Property Details`.
- Pass `propertyId` to `PropertyDetailsScreen`.

# Imports

- `import type { Metadata } from "next"`
- `import PropertyDetailsScreen from "@/src/features/property/screens/PropertyDetailsScreen"`

# Exports

- `metadata`
- `PropertyDetailsPage`
- `default`

# State Management

_No significant state; presentational or config module._

# API Usage

- Indirect: page renders `PropertyDetailsScreen` → `usePropertyDetails` → `GET /properties/:id`.

# Navigation

- Public URLs: `/en/propert-details/<id>` (locale-prefixed).
- `params`: `Promise<{ locale: string; id: string }>` (Next.js 16 async params).

# Props / Parameters

| Param | Source | Purpose |
| --- | --- | --- |
| `params.id` | URL segment | Property listing id passed to screen as `propertyId` |

# Actions / Inputs

_No user inputs._

# UI Details

- **Theme:** semantic tokens via feature screen / `ComingSoonCard`
- **Light/dark:** via `ThemeProvider`
- **Radius:** `rounded-xl` on placeholder card
- **Responsive:** mobile-first via shared card component

# Flow Description

1. Next.js resolves `/en/propert-details/123` → `locale=en`, `id=123`.
2. `(property)/layout.tsx` provides `PublicLayout`.
3. Page awaits `params`, passes `id` to `PropertyDetailsScreen`.
4. Screen fetches property and renders `PropertyView`.

# Dependencies

- [../../../../src/features/property/screens/PropertyDetailsScreen.md](../../../../src/features/property/screens/PropertyDetailsScreen.md)
- [../layout.md](../layout.md)

# Notes

- Parent folder remains `propert-details` (existing route segment spelling).
