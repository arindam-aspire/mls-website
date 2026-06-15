# File Overview

React Query hooks for loading property lists, details, and favourites.

**Source:** `src/features/property/mutations/property.mutation.ts`

# Responsibilities

- Expose mutation hooks for on-demand property fetches.
- Expose `useGetAllFavorites` query for authenticated favourite lookup on the property list.
- Show toast feedback on API failure (mutations and paginated favourite fetch).

# Imports

- `useMutation`, `useQuery` from `@tanstack/react-query`
- `ApiError` from `@/src/apis/core/error.normalizer`
- `useToast` from `@/src/hooks/useToast`
- `getPropertyDetails`, `getPropertyList` from `../services/property.service`

# Exports

- `useGetPropertyList`
- `useGetPropertyDetails`
- `useGetSimilarProperties`
- `useGetPropertyFeatureCatalog`
- `useGetAllFavorites`
- `FAVORITES_ALL_QUERY_KEY`
- `useSavePropertyDraftSubmission`
- `useUpdatePropertyDraftSubmission`
- `useSubmitPropertyDraftSubmission`
- `PropertyListingsNamespace` — `"myListings" | "manageListings"` for listing table toast copy
- `useDeletePropertySubmission`
- `useGetAgentProperties`
- `useGetFavoriteList`
- `useRemoveFavorite`
- `useAddFavorite`
- `useAddRecentView`
- `useGetRecentViewsList`
- `useRemoveRecentView`
- `useClearRecentViews`

# State Management

- TanStack Query mutation state for list/detail fetches.
- `useGetAllFavorites`: query state (`data`, `isFetching`) with `enabled` option; no error toast.

# API Usage

| Hook | Service | Endpoint |
| --- | --- | --- |
| `useGetPropertyList` | `getPropertyList(params)` | `GET /properties` |
| `useGetPropertyDetails` | `getPropertyDetails(id)` | `GET /properties/:id` |
| `useGetSimilarProperties` | `getSimilarProperties(id)` | `GET /properties/:id/similar` |
| `useGetPropertyFeatureCatalog` | `getPropertyFeatureCatalog()` | `GET /features?is_active=true` |
| `useGetPropertyDraftSubmission` | `getPropertyDraftSubmission(submissionId)` | `GET /property-submissions/{id}` (auth) |
| `useSavePropertyDraftSubmission` | `savePropertyDraftSubmission(body)` | `POST /property-submissions` (auth); toasts in `usePropertyCreateScreen` |
| `useUpdatePropertyDraftSubmission` | `updatePropertyDraftSubmission(id, body)` | `PATCH /property-submissions/{id}` (`action: save_draft`) |
| `useSubmitPropertyDraftSubmission` | `submitPropertyDraftSubmission(id, body)` | `POST /property-submissions/{id}/submit` (`confirm_submit: true`); toasts in `usePropertyCreateScreen` |
| `useGetAllFavorites` | `getAllFavorites()` | `GET /favorites` (auth) |
| `useGetAgentProperties` | `getAgentProperties(params)` | `GET /agent-properties?page=&pageSize=` — optional `listingsNamespace` for fetch error toast |
| `useGetAdminPropertySubmissions` | `getAdminPropertySubmissions(params)` | `GET /admin/property-submissions?status=&page=&pageSize=` (auth) |
| `useReviewAdminPropertySubmission` | `reviewAdminPropertySubmission(submissionId, body)` | `POST /admin/property-submissions/{submissionId}/review` (auth) |
| `useDeletePropertySubmission` | `deletePropertySubmission(submissionId)` | `DELETE /property-submissions/{id}` — optional `listingsNamespace` for delete error toast |
| `useGetAgentPropertyDrafts` | `getAgentPropertyDrafts(params)` | `GET /agent-properties/drafts?page=&pageSize=` (auth) |
| `useGetFavoriteList` | `getFavoriteList(params)` | `GET /favorites?page=&pageSize=` |
| `useAddFavorite` | `addFavorite({ property_hash })` | `POST /favorites` |
| `useAddRecentView` | `addRecentView(body)` | `POST /users/recent-views` (silent; no toast) |
| `useRemoveRecentView` | `removeRecentView(propertyHashId)` | `DELETE /users/recent-views/{propertyHashId}` |
| `useClearRecentViews` | `clearRecentViews()` | `DELETE /users/recent-views` |
| `useGetRecentViewsList` | `getRecentViewsList(params)` | `GET /users/recent-views?page=&pageSize=` |
| `useRemoveFavorite` | `removeFavorite(propertyHash)` | `DELETE /favorites/:propertyHash` |

# Navigation

_N/A._

# Props / Parameters

The returned mutation expects `PropertyListParams` when calling `mutate` / `mutateAsync`.

# Actions / Inputs

- Triggered when caller executes mutation (e.g., on submit/filter apply).

# UI Details

_N/A._

# Flow Description

1. Caller invokes `useGetPropertyList`.
2. Hook executes `getPropertyList` when mutation runs.
3. On failure, shows `Failed to fetch properties` toast with API error message.

# Dependencies

- [property.service.md](../services/property.service.md)
- [property.types.md](../types/property.types.md)

# Notes

- Even though this is a `GET`, mutation is used for explicit, event-driven fetches.
