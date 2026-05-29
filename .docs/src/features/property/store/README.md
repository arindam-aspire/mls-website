# Property store (`src/features/property/store/`)

Zustand state container for property list filters and fetched list results.

| File | Export |
| --- | --- |
| [property.store.md](./property.store.md) | `usePropertyStore` |

## Notes

- Keeps list query params (`page`, `pageSize`, `category`, `status`).
- Stores last fetched property listings for reuse across property screens.
- Stores landing property taxonomy payload for cross-feature filter hydration.
