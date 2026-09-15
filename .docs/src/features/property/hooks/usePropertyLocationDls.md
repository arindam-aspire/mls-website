# File Overview

Logic hook for Add Property Step 2 DLS cascading selects: Government → Department → Village → HOD → Section.

**Source:** `src/features/property/hooks/usePropertyLocationDls.ts`

# Responsibilities

- Fetch DLS options from `GET /dls-locations` with `level` plus the required parent codes.
- Enable each child query only after the previous code is selected.
- Map API `code` / `name` pairs to `Select` options (name as label; code appended when names collide).
- Clear descendant codes when a parent changes.
- Expose loading, empty, API-error, and retry state using the Agency-field pattern.

# Imports

- `getDlsLocations`
- `dlsLocations.mapper` (`getDlsLocationItems`, `mapDlsLocationItemsToSelectOptions`, `findDlsLocationName`)
- `EMPTY_PROPERTY_LOCATION_DLS`
- `useQuery` from TanStack Query

# Exports

- `usePropertyLocationDls`
- `PropertyLocationDlsFieldModel`
- `UsePropertyLocationDlsParams`

# State Management

- **TanStack Query:** one query per level. Government always loads; children are `enabled` only when parent codes exist.
- Query keys include the parent codes so changing a parent fetches a new child list.

# API Usage

| Method | Endpoint | When |
| --- | --- | --- |
| GET | `/dls-locations?level=gov` | Location step mount |
| GET | `/dls-locations?level=dept&gov_code=` | After Government |
| GET | `/dls-locations?level=vill&gov_code=&dept_code=` | After Department |
| GET | `/dls-locations?level=hod&gov_code=&dept_code=&vill_code=` | After Village |
| GET | `/dls-locations?level=sect&gov_code=&dept_code=&vill_code=&hod_code=` | After HOD |

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `selection` | Current DLS codes and names from host location state |
| `onChange` | Writes the next selection (parent plus cleared descendants) |
| `disabled` | Locks fields while the form is read-only, saving, or submitting |
| `labels` | Localized `propertyList.propertyCreate.dls.*` copy |

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `sectionTitle` | DLS heading |
| `fields` | Five select models for `PropertyLocationDlsFields` |

# UI Details

_N/A — hook only._

# Flow Description

1. Government options load from the DLS API.
2. Choosing a government stores `gov_code` / `gov_name` and clears lower levels.
3. Each next query uses the selected parent codes only — the 16,685-row Excel catalog is never downloaded.
4. Loading uses the shared hint; empty lists use the empty hint; failures show `loadError` plus Retry.

# Dependencies

- [PropertyLocationDlsFields.md](../components/PropertyLocationDlsFields.md)
- [dls.service.md](../services/dls.service.md)
- [dlsLocations.mapper.md](../mappers/dlsLocations.mapper.md)
- [propertyLocationDls.i18n.md](../i18n/propertyLocationDls.i18n.md)
