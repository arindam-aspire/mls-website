# File Overview

Formats an ISO date string for the **Submitted on** column in My Listings table.

**Source:** `src/features/property/utils/formatListingSubmittedDate.ts`

# Responsibilities

- Parse API `submission_submitted_at` (stored on mapped row as `validatedDate`).
- Return `null` for missing or invalid values (caller shows `columns.submittedOnEmpty`).
- Use `Intl.DateTimeFormat` with locale mapping (`en` → `en-US`, `fr` → `fr-FR`, etc.).

# Exports

- `formatListingSubmittedDate(value, locale)`

# Dependencies

- Used by `buildMyListingTableColumns.tsx`
