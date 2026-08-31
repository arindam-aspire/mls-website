# File Overview

Route-level property details screen. Renders `PropertyView` from `@abdoun/abdoun-library`; all logic lives in `usePropertyDetails`.

**Source:** `src/features/property/screens/PropertyDetailsScreen.tsx`

# Responsibilities

- Compose `PropertyView` with data and handlers from `usePropertyDetails`.
- Render `SimilarProperties` from `@abdoun/abdoun-library` below the detail view.
- Show `UpcomingFeatureModal` only when other unreleased features trigger it (contact actions no longer use it).
- Show a not-found panel when fetch fails or returns no data.
- **Public view** (guests and `registered_user`): hide **Property workflow** panel.
- **Owner visibility:** `PropertyView` shows owner information only to agent, agency/admin, and super-admin roles (`owners[]` supported in library v0.1.80+). Guests, owners, and registered users receive `showOwner={false}`.
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
- **Contact cards:** scoped styles in `app/globals.css` keep the price summary, Listing Agent, and Owner Details in independent matching card surfaces. Listing Agent and Owner Details never share one visual card. The same split layout is applied to the loading skeleton.
- **Neighborhood:** the `property-details-view` scope enables the app stylesheet to hide only the library's empty neighborhood placeholder and expand the map to the card's available width. Real local highlights and lifestyle content retain the library layout.

# Flow Description

1. Page passes `propertyId` from URL.
2. Hook fetches property details.
3. Loading: `PropertyView` skeleton via `isLoading`.
4. Error / missing data: not-found article.
5. Success: `PropertyView` with tabs, feature catalog, and visually separate price, Listing Agent, and Owner Details cards while preserving the library handlers and role-based visibility.
6. Neighborhood with no descriptive data: the empty placeholder is omitted and the existing map fills the padded card at mobile, tablet, and desktop widths.
7. **Owner details:** library `PropertyView` owner block (single or multiple owners) appears only for agent, agency/admin, and super-admin roles.
8. **Property workflow** only when `canViewRestrictedTabs`.
9. `SimilarProperties` carousel below, fed by `similarListings` / `isSimilarLoading`.

# Dependencies

- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)
- [../../../components/common/UpcomingFeatureModal.md](../../../components/common/UpcomingFeatureModal.md)
- [../../../../app/[locale]/(property)/propert-details/[id]/page.md](../../../../app/[locale]/(property)/propert-details/[id]/page.md)

# Notes

- `applicationKey` is `"abdoun_web"` (library branding).
- Feature catalog is loaded from `GET /features?is_active=true` and mapped for `PropertyView.features`.
- Similar properties API (`GET /properties/:id/similar`) loads in `usePropertyDetails`; rendered via library `SimilarProperties`.
