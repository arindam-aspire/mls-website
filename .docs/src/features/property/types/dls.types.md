# File Overview

TypeScript shapes for official DLS hierarchy lookups and the Add Property DLS selection.

**Source:** `src/features/property/types/dls.types.ts`

# Responsibilities

- `DlsLevel`: `gov` \| `dept` \| `vill` \| `hod` \| `sect`.
- `DlsLocationItem`: API row with `code`, `name`, `level`, and parent codes.
- `DlsLocationsQuery` / `DlsLocationsResponse`: `GET /dls-locations` contract.
- `PropertyLocationDlsSelection`: selected codes and display names stored on the property payload.

# Exports

- `DlsLevel`
- `DlsLocationItem`
- `DlsLocationsQuery`
- `DlsLocationsData`
- `DlsLocationsResponse`
- `PropertyLocationDlsSelection`

# Dependencies

- [dls.service.md](../services/dls.service.md)
- [dlsLocations.mapper.md](../mappers/dlsLocations.mapper.md)
