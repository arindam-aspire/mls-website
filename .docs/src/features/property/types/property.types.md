# File Overview

TypeScript types for property list and detail APIs, aligned with `@abdoun/abdoun-library` `PropertyView` shapes where applicable.

**Source:** `src/features/property/types/property.types.ts`

# Responsibilities

- Define query params for listing properties (`PropertyListParams`).
- Define list and detail API wrappers (`PropertyListResponse`, `PropertyDetailsResponse`).
- Export `PropertyDetails` and `PropertyFeatureDefinition` (inferred from `PropertyView` props).
- Define feature catalog API types (`FeatureCatalogItem`, `FeatureCatalogResponse`).

# Imports

- `PropertyView` from `@abdoun/abdoun-library` (type-only)

# Exports

- `PropertyListParams`
- `PropertyListResponse`
- `PropertyDetails`
- `PropertyFeatureDefinition`
- `PropertyDetailsResponse`
- `PropertySimilarResponse`
- `FeatureCatalogItem`
- `FeatureCatalogResponse`
- `AgentPropertiesListParams`
- `AgentPropertyListItem`
- `AgentPropertiesListData`
- `AgentPropertiesListResponse`
- `AgentPropertiesListings`

# State Management

_N/A — type-only module._

# API Usage

| Type | Endpoint | Method |
| --- | --- | --- |
| `PropertyListResponse` | `/properties` | GET |
| `PropertyDetailsResponse` | `/properties/:id` | GET |
| `PropertySimilarResponse` | `/properties/:id/similar` | GET |
| `FeatureCatalogResponse` | `/features?is_active=true` | GET |
| `AgentPropertiesListResponse` | `/agent-properties` | GET |

Request query shape: `PropertyListParams` — required: `page`, `pageSize`, `category`, `status`; optional: `sort`, `type`, `location`, `budgetMin`, `budgetMax`, `furnitureStatus`, `bedrooms`, `bathrooms`, `parking`, `propertyAge`, `minArea`, `maxArea`, `amenities`, `similar_to`, `savedSearchId`.

URL-synced filters: all `PropertyListParams` fields (see [property.types.md](./property.types.md)).

## Agent properties (`GET /agent-properties`)

`AgentPropertyListItem` — one row in `data.items`:

| Field | API example |
| --- | --- |
| `property_id` | UUID |
| `property_hash` | numeric hash |
| `title` | plain string |
| `listing_purpose` | e.g. `sale` |
| `type_name` / `type_slug` | e.g. Building / `building` |
| `category_name` / `category_slug` | e.g. Residential / `residential` |
| `status_name` / `status_slug` | e.g. Verified / `verified` |
| `price` / `currency` | e.g. `12000.00` / `JOD` |
| `reference_number` | e.g. `REF-0056` |
| `created_at` / `updated_at` | ISO timestamps |
| `submission_*` | submission workflow fields |
| `submission_workflow_label` | e.g. `pending_admin_approval` |
| `can_edit_submission` / `can_delete_submission` | booleans |
| `agency` | `null` or agency object (typed `unknown` until API shape is fixed) |

`AgentPropertiesListData` also includes pagination fields (`total`, `page`, `pageSize`, `totalPages`, `hasNext`, `hasPrevious`) duplicated under `meta.pagination`.

`AgentPropertiesListParams`: required `page`, `pageSize`; optional `search`, `status` (omitted when empty / “All”).

Mapping to UI/`PropertyListing` is not implemented yet.

# Navigation

_N/A._

# Props / Parameters

| Name | Purpose |
| --- | --- |
| `PropertyListParams.page` | Page number |
| `PropertyListParams.pageSize` | Page size |
| `PropertyListParams.category` | Category filter |
| `PropertyListParams.status` | Status filter |
| `PropertyListParams.sort?` | Sort key (e.g. `newest`, `price_asc`, `price_desc`) |
| `PropertyListParams.type?` | Property type filter |
| `PropertyListParams.location?` | Location filter |
| `PropertyListParams.budgetMin?` | Minimum budget |
| `PropertyListParams.budgetMax?` | Maximum budget |
| `PropertyListParams.furnitureStatus?` | Furnishing filter |
| `PropertyListParams.bedrooms?` | Bedroom count |
| `PropertyListParams.bathrooms?` | Bathroom count |
| `PropertyListParams.parking?` | Parking count |
| `PropertyListParams.propertyAge?` | Property age filter |
| `PropertyListParams.minArea?` | Minimum area |
| `PropertyListParams.maxArea?` | Maximum area |
| `PropertyListParams.amenities?` | Amenities filter |
| `PropertyListParams.similar_to?` | Similar-to property id (from detail “View More”) |
| `PropertyListParams.savedSearchId?` | Saved search id when opening a saved search from the popover or saved-searches page |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. [property.service.ts](../services/property.service.ts) calls `apiClient` with `propertyEndpoints.PROPERTY_LIST(params)`.
2. Future React Query hooks will consume `PropertyListResponse`.
3. UI maps `getProperties(data)` to cards or list rows.

# Dependencies

- [propertyEndpoints.ts](../../../../apis/endpoints/propertyEndpoints.ts) — path constant
- [property/README.md](../README.md) — feature overview

# Notes

- `PropertyListResponse.data` is `unknown` until the backend list schema is confirmed.
