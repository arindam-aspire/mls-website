# File Overview

React Query mutation hooks for landing feature API calls.

**Source:** `src/features/landing/mutations/landing.mutation.ts` (Client Component)

# Responsibilities

- Fetch property taxonomy via `getPropertyTaxonomy`.
- Fetch location taxonomy via `getLocationTaxonomy`.
- Store taxonomy responses into `usePropertyStore` on success.
- Surface API failures with toast feedback.

# Imports

- `useMutation` from `@tanstack/react-query`
- `getPropertyTaxonomy`, `getLocationTaxonomy` from `../services/landing.service`
- `usePropertyStore` from `src/features/property/store/property.store`
- `useToast` from `src/hooks/useToast`

# Exports

- `useGetPropertyTaxonomy`
- `useGetLocationTaxonomy`

# State Management

- Uses TanStack Mutation state (`data`, `isPending`, `error`).
- Writes taxonomy payload into Zustand property store.

# API Usage

- `GET /property-taxonomy` through `getPropertyTaxonomy`.
- `GET /location-taxonomy` through `getLocationTaxonomy`.

# Navigation

_No direct navigation._

# Flow Description

1. `LandingScreen` invokes `useGetPropertyTaxonomy().mutate()` and `useGetLocationTaxonomy().mutate()` when store cache is empty.
2. Mutations call `landing.service`.
3. On success, responses are persisted with `setPropertyTaxonomy` / `setLocationTaxonomy`.
4. On error, toast displays failure message.

# Notes

- Keep in sync when `src/features/landing/mutations/landing.mutation.ts` changes.
