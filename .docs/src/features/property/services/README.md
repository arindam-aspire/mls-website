# Property services (`src/features/property/services/`)

HTTP calls for property feature APIs.

| File | Export |
| --- | --- |
| [property.service.md](./property.service.md) | `getPropertyList` — `GET /properties` |

Uses `apiClient` with optional auth for public catalogue endpoints (`getPropertyList`, `getPropertyDetails`, `getSimilarProperties`): `auth: tokenStore.hasAuthCredentials()` so `Authorization` is sent when a session exists, and guests still work without a token. Endpoint path built via `propertyEndpoints.PROPERTY_LIST(params)`.
