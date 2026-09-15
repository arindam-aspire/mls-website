# File Overview

Public DLS hierarchy lookup for Add Property cascading selects.

**Source:** `src/features/property/services/dls.service.ts`

# Responsibilities

- `GET /dls-locations?level=&gov_code=&dept_code=&vill_code=&hod_code=` via `authClient` (same public-catalog client as location taxonomy).
- Does not load `dls_locations.csv` / Excel in the browser.

# Exports

- `getDlsLocations(params)`

# API Usage

- Path from `publicEndpoints.DLS_LOCATIONS(params)`.
- Auth default is off (`authClient`); the Add Property screen is already behind a signed-in route.

# Dependencies

- [../../../apis/endpoints/publicEndpoints.md](../../../apis/endpoints/publicEndpoints.md)
- [dls.types.md](../types/dls.types.md)
