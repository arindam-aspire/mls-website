# File Overview

Route-level property details screen. Renders `PropertyView` from `@abdoun/abdoun-library`; all logic lives in `usePropertyDetails`.

**Source:** `src/features/property/screens/PropertyDetailsScreen.tsx`

# Responsibilities

- Compose `PropertyView` with data and handlers from `usePropertyDetails`.
- Show `UpcomingFeatureModal` for unreleased favourite and agent email actions.
- Show a not-found panel when fetch fails or returns no data.

# Imports

- `PropertyView` from `@abdoun/abdoun-library`
- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`
- `usePropertyDetails` from `../hooks/usePropertyDetails`

# Exports

- `PropertyDetailsScreen` (default)

# State Management

_All state in `usePropertyDetails`._

# API Usage

Indirect via `usePropertyDetails` → `GET /properties/:id`.

# Navigation

- Route: `/en/propert-details/<id>` via [propert-details/[id]/page.md](../../../../app/[locale]/(property)/propert-details/[id]/page.md)

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `propertyId` | `string` | Property id from URL `[id]` segment |

# Actions / Inputs

| User action | Handler |
| --- | --- |
| Tab change | `tabs.onTabChange` → updates `?tab=` in URL |
| Favourite | `onClickFavourite` → upcoming modal |
| Agent email | `onClickAgentEmail` → upcoming modal |

# UI Details

- **Theme:** semantic tokens on error panel; library uses app CSS variables
- **Radius:** `rounded-xl` on error article
- **Responsive:** mobile-first via `PropertyView` and error copy scaling
- **Light/dark:** via `ThemeProvider` and `globals.css`

# Flow Description

1. Page passes `propertyId` from URL.
2. Hook fetches property details.
3. Loading: `PropertyView` skeleton via `isLoading`.
4. Error / missing data: not-found article.
5. Success: `PropertyView` with tabs, agent/owner blocks, and feature catalog.

# Dependencies

- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)
- [../../../components/common/UpcomingFeatureModal.md](../../../components/common/UpcomingFeatureModal.md)
- [../../../../app/[locale]/(property)/propert-details/[id]/page.md](../../../../app/[locale]/(property)/propert-details/[id]/page.md)

# Notes

- `applicationKey` is `"abdoun_web"` (library branding).
- Feature catalog is loaded from `GET /features?is_active=true` and mapped for `PropertyView.features`.
