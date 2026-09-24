# File Overview

Shared constants for DLS / listing **arrangements**: Properties (Residential + Commercial) vs Land.

**Source:** `src/features/property/constants/propertyArrangement.constants.ts`

# Responsibilities

- Define `PropertyArrangementId` (`properties` | `land`).
- Map each arrangement to taxonomy category slugs used by search, filters, and create.

# Exports

| Export | Purpose |
| --- | --- |
| `PROPERTY_ARRANGEMENT_IDS` | Canonical arrangement id list |
| `PropertyArrangementId` | Arrangement union type |
| `DEFAULT_PROPERTY_ARRANGEMENT` | `"properties"` |
| `PROPERTY_ARRANGEMENT_CATEGORY_SLUGS` | Slug lists per arrangement |

# Dependencies

- Used by [propertyArrangement.md](../utils/propertyArrangement.md) and category UIs (hero, list filters, saved search, property create).
