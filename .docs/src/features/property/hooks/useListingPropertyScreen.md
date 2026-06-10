# File Overview

Screen hook for `ListingPropertyScreen`: fetches the authenticated user's agent properties list.

**Source:** `src/features/property/hooks/useListingPropertyScreen.ts`

# Responsibilities

- Call `GET /agent-properties` with `page`, `pageSize`, and optional `search` / `status` query params.
- Own filter state (`search`, `status`); refetch when either changes (page resets to `1`).
- Store `listings` as `AgentPropertyListItem[]`, `paginationMeta`, and current `requestParams`.
- Expose `filters` props for `MyListingFilters`.
- Pagination from `meta.pagination` or fallback to `data` pagination fields.
- Expose `fetchAgentProperties(params)` to refetch with updated query params.

# API Usage

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/agent-properties?page=&pageSize=` | `auth: true` |

- Service: `getAgentProperties` in `property.service.ts`
- Mutation: `useGetAgentProperties` in `property.mutation.ts`
- Endpoint builder: `propertyEndpoints.AGENT_PROPERTIES`

# State Management

- Local state for listings, pagination meta, and request params.
- `isLoading` true until first response or while mutation is pending.

# Exports

- `useListingPropertyScreen()`

# Dependencies

- `AgentPropertiesListParams`, `AgentPropertyListItem`, `AgentPropertiesListResponse` in `property.types.ts`
- `propertyList.myListings.fetchError` for mutation error toast
