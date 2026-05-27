# File Overview

React Query mutation hook for loading property lists on-demand.

**Source:** `src/features/property/mutations/property.mutation.ts`

# Responsibilities

- Expose `useGetPropertyList` hook.
- Call `getPropertyList` service through TanStack Query mutation lifecycle.
- Show toast feedback on API failure.

# Imports

- `useMutation` from `@tanstack/react-query`
- `ApiError` from `@/src/apis/core/error.normalizer`
- `useToast` from `@/src/hooks/useToast`
- `getPropertyList` from `../services/property.service`

# Exports

- `useGetPropertyList`

# State Management

- TanStack Query mutation state: `isPending`, `isError`, `data`, `error`.

# API Usage

| Hook | Service | Endpoint |
| --- | --- | --- |
| `useGetPropertyList` | `getPropertyList(params)` | `GET /properties` |

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
