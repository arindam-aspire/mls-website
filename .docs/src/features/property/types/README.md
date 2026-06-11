# Property types (`src/features/property/types/`)

TypeScript definitions for property API payloads and list responses.

## Files

| File | Contents |
| --- | --- |
| [property.types.md](./property.types.md) | `PropertyListParams`, `PropertyListResponse` |
| [propertyDraftSubmission.types.md](./propertyDraftSubmission.types.md) | `PropertyDraftSubmissionRequestBody` (`payload` + `current_step`) and nested payload sections |

## Usage

- Import from `@/src/features/property/types/property.types` in services, queries, and screens.
- API responses follow `{ success, message, data, error, meta }` (same as auth and landing).
- `GET /properties` maps to `propertyEndpoints.PROPERTY_LIST`.

## Notes

- Extend `Property` and `PropertyListParams` when the backend contract is finalized.
