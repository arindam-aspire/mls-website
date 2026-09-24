# File Overview

Helpers that resolve and filter property taxonomy categories by DLS arrangement.

**Source:** `src/features/property/utils/propertyArrangement.ts`

# Responsibilities

- Map a category slug → arrangement (`land` vs `properties`).
- Filter category lists for a selected arrangement.
- Pick a default category slug when switching arrangements.

# Exports

| Function | Purpose |
| --- | --- |
| `isPropertyArrangementId` | Type guard |
| `resolvePropertyArrangementFromCategorySlug` | Slug → arrangement |
| `filterCategoriesByArrangement` | Taxonomy filter |
| `defaultCategorySlugForArrangement` | First category in arrangement |
| `isCategoryInArrangement` | Membership check |

# Dependencies

- [propertyArrangement.constants.md](../constants/propertyArrangement.constants.md)
