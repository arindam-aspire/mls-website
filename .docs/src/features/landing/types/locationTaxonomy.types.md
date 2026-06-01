# File Overview

TypeScript types for `GET /location-taxonomy`.

**Source:** `src/features/landing/types/locationTaxonomy.types.ts`

# Responsibilities

- `LocationCity` — `{ id, name, areas[] }` (e.g. Amman with Abdoun, 1st Circle, …).
- `LocationArea` — `{ id, name }` under a city.
- `getLocationCities()` — reads `data.data` or a bare `data` array from the API envelope.

# Exports

- `LocationArea`
- `LocationCity`
- `LocationTaxonomyResponse`
- `getLocationCities`
- `getLocationCategories` (alias)

# Notes

- Internal option values encode names: `cityName|locationName` (e.g. `Amman|Al Jandaweel`).
- URL/API params `city` and `locations` pass the **display names** (not numeric ids).
