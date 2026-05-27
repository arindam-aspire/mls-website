# Property store (`src/features/property/store/`)

Zustand state container for property list filters and fetched list results.

| File | Export |
| --- | --- |
| [property.store.md](./property.store.md) | `usePropertyStore` |

## Notes

- Keeps list query params (`page`, `pageSize`, `category`, `status`).
- Stores last fetched `PropertyListResponse` for reuse across property screens.
