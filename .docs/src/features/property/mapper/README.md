# Property mappers (`src/features/property/mapper/`)

Transforms API or store shapes into UI-ready models for property screens.

## Files

| File | Purpose |
| --- | --- |
| [propertyList.mapper.md](./propertyList.mapper.md) | Property list mapping (placeholder) |
| [propertyFeatures.mapper.md](./propertyFeatures.mapper.md) | Feature catalog → `PropertyView` features |

## Conventions

- One mapper module per screen or list flow (`*.mapper.ts`, camelCase).
- Keep mapping pure (no side effects, no API calls).
- Import types from [../types](../types/README.md); consume from screens, not from services.

## Related

- [../services](../services/README.md) — API responses
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md) — list UI
