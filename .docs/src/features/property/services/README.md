# Property services (`src/features/property/services/`)

HTTP calls for property feature APIs.

| File | Export |
| --- | --- |
| [property.service.md](./property.service.md) | `getPropertyList` — `GET /properties` |

Uses `apiClient` with `auth: true` (default). Endpoint path built via `propertyEndpoints.PROPERTY_LIST(params)`.
