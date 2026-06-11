# File Overview

API service for listing and fetching a single property.

**Source:** `src/features/property/services/property.service.ts`

# Responsibilities

- Call `GET /properties` with query params from `PropertyListParams`.
- Call `GET /properties/:id` for a single property record.
- Call `GET /properties/:id/similar` for related listings.
- Call `GET /agent-properties?page=&pageSize=` for the owner's my-listings screen.
- Call `POST /property-submissions` with `{ payload, current_step }` to create a property draft.
- Call `PATCH /property-submissions/{submissionId}` with `{ action: "save_draft", current_step, payload }` to update an existing draft.
- Call `GET /favorites?page=&pageSize=` for paginated favourites (favourites screen).
- Call `GET /favorites` with no query params for the full favourites list (property list heart state).
- Call `DELETE /favorites/:propertyHash` to remove a favourite.
- Call `GET /users/recent-views?page=&pageSize=` for paginated recently viewed properties.
- Call `POST /users/recent-views` with `{ property_hash_id }` to record a property view.
- Call `DELETE /users/recent-views/{propertyHashId}` to remove one recent view.
- Call `DELETE /users/recent-views` to clear all recent views.

# Imports

- `apiClient` from `@/src/apis/clients/api.client`
- `propertyEndpoints` from `@/src/apis/endpoints/propertyEndpoints`
- `userEndpoints` from `@/src/apis/endpoints/userEndpoints`
- `PropertyDetailsResponse`, `PropertyListParams`, `PropertyListResponse` from `../types/property.types`

# Exports

- `getPropertyList`
- `getPropertyDetails`
- `getSimilarProperties`
- `getPropertyFeatureCatalog`
- `getAgentProperties`
- `getAgentPropertyDrafts`
- `savePropertyDraftSubmission`
- `updatePropertyDraftSubmission`
- `getFavoriteList`
- `getAllFavorites`
- `addFavorite`
- `removeFavorite`
- `getRecentViewsList`
- `addRecentView`
- `clearRecentViews`
- `removeRecentView`

# State Management

_N/A — stateless service._

# API Usage

| Function | Method | Path | Auth |
| --- | --- | --- | --- |
| `getPropertyList` | GET | `/properties?…` | no (`auth: false`) |
| `getPropertyDetails` | GET | `/properties/:id` | no (`auth: false`) |
| `getSimilarProperties` | GET | `/properties/:id/similar` | no (`auth: false`) |
| `getPropertyFeatureCatalog` | GET | `/features?is_active=true` | no (`auth: false`) |
| `getAgentProperties` | GET | `/agent-properties?page=&pageSize=` | yes |
| `getAgentPropertyDrafts` | GET | `/agent-properties/drafts?page=&pageSize=` | yes |
| `getFavoriteList` | GET | `/favorites?page=&pageSize=` | yes |
| `getAllFavorites` | GET | `/favorites` | yes |
| `addFavorite` | POST | `/favorites` body `{ property_hash }` | yes |
| `removeFavorite` | DELETE | `/favorites/:propertyHash` | yes |
| `getRecentViewsList` | GET | `/users/recent-views?page=&pageSize=` | yes |
| `addRecentView` | POST | `/users/recent-views` body `{ property_hash_id }` | yes |
| `removeRecentView` | DELETE | `/users/recent-views/{propertyHashId}` | yes |
| `clearRecentViews` | DELETE | `/users/recent-views` | yes |

Query string built by `propertyEndpoints.PROPERTY_LIST(params)` (`page`, `pageSize`, `category`, `status`).

# Navigation

_N/A._

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `params` | `PropertyListParams` | List filters and pagination |
| `id` | `string` | Property id for detail or similar fetch |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. Caller (future React Query hook or screen) passes `PropertyListParams`.
2. Service requests `propertyEndpoints.PROPERTY_LIST(params)`.
3. Returns typed `PropertyListResponse`.

# Dependencies

- [propertyEndpoints.ts](../../../apis/endpoints/propertyEndpoints.ts)
- [property.types.ts](../types/property.types.md)

# Notes

- Refine `PropertyListResponse.data` when the backend list schema is confirmed.
