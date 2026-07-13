# File Overview

Route-level property details screen. Renders `PropertyView` from `@abdoun/abdoun-library`; all logic lives in `usePropertyDetails`.

**Source:** `src/features/property/screens/PropertyDetailsScreen.tsx`

# Responsibilities

- Compose `PropertyView` with data and handlers from `usePropertyDetails`.
- Render `SimilarProperties` from `@abdoun/abdoun-library` below the detail view.
- Show `UpcomingFeatureModal` only when other unreleased features trigger it (contact actions no longer use it).
- Show a not-found panel when fetch fails or returns no data.
- **Public view** (guests and `registered_user`): hide **Property workflow** panel.
- **Guest (unsigned):** `PropertyView` uses `showOwner={false}`.
- **Signed-in users:** owner information comes from the library `PropertyView` owner block (`owners[]` supported in library v0.1.80+).
- **Restricted view** (agency / agent / owner): show workflow panel when API data is available.

# Imports

- `PropertyView`, `SimilarProperties` from `@abdoun/abdoun-library`
- `useRouter` from `@/src/i18n/navigation`
- `UpcomingFeatureModal` from `@/src/components/common/UpcomingFeatureModal`
- `usePropertyDetails` from `../hooks/usePropertyDetails`

# Exports

- `PropertyDetailsScreen` (default)

# State Management

_All state in `usePropertyDetails`._

# API Usage

Indirect via `usePropertyDetails` → `GET /properties/:id`, `GET /properties/:id/similar`.

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
| Favourite | `onClickFavourite` on `PropertyView` and `SimilarProperties` → add/remove favourite (guest → auth modal) |
| Agent email / call / WhatsApp | `onClickAgentEmail`, `onClickAgentPhone`, `onClickAgentWhatsApp` → native contact links via hook |
| Owner email / call / WhatsApp | `onClickOwnerEmail`, `onClickOwnerPhone`, `onClickOwnerWhatsApp` → native contact links via hook (per-owner when multiple) |
| Workflow actions | Agency / agent / owner only — `PropertyStatusActionPanel` |

# UI Details

- **Theme:** semantic tokens on error panel and workflow card (`bg-surface`, `border-secondary/15`); library uses app CSS variables
- **Radius:** `rounded-xl` on error article and workflow panel; `rounded-lg` on workflow icon chips
- **Responsive:** mobile-first via `PropertyView` and error copy scaling
- **Light/dark:** via `ThemeProvider` and `globals.css`
- **Sidebar:** `PropertyView` uses `showStatusActionCard={false}` and `showPropertyMetrics={false}` so the library **Property Status** card and **Avg. per unit / Documents** metrics are hidden; handover from API is shown as a library `HandoverBadge` when present. Agency workflow stays in MLS `PropertyStatusActionPanel` below the view.

# Flow Description

1. Page passes `propertyId` from URL.
2. Hook fetches property details.
3. Loading: `PropertyView` skeleton via `isLoading`.
4. Error / missing data: not-found article.
5. Success: `PropertyView` with tabs, agent block, and feature catalog.
6. **Owners (signed-in):** library `PropertyView` owner block via `showOwner` (single or multiple owners).
7. **Property workflow** only when `canViewRestrictedTabs`.
8. `SimilarProperties` carousel below, fed by `similarListings` / `isSimilarLoading`.

# Dependencies

- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)
- [../../../components/common/UpcomingFeatureModal.md](../../../components/common/UpcomingFeatureModal.md)
- [../../../../app/[locale]/(property)/propert-details/[id]/page.md](../../../../app/[locale]/(property)/propert-details/[id]/page.md)

# Notes

- `applicationKey` is `"abdoun_web"` (library branding).
- Feature catalog is loaded from `GET /features?is_active=true` and mapped for `PropertyView.features`.
- Similar properties API (`GET /properties/:id/similar`) loads in `usePropertyDetails`; rendered via library `SimilarProperties`.
