# File Overview

Formats an ISO date-time string for **Submitted on** and **Reviewed on** columns in My Listings and Manage Listings tables.

**Source:** `src/features/property/utils/formatListingSubmittedDate.ts`

# Responsibilities

- Parse API timestamps (`submission_submitted_at` / `submission_reviewed_at`, or admin `submitted_at` / `reviewed_at` on mapped rows as `validatedDate` / `reviewedDate`).
- Return `null` for missing or invalid values (caller shows `columns.submittedOnEmpty` or `columns.reviewedOnEmpty`).
- Use `Intl.DateTimeFormat` with locale mapping (`en` → `en-US`, `fr` → `fr-FR`, etc.).
- Output includes **date and time** with **12-hour clock** (`hour12: true`), e.g. `Jun 12, 2026, 8:50 AM` in English.

# Exports

- `formatListingSubmittedDate(value, locale)`

# Dependencies

- Used by `buildMyListingTableColumns.tsx` (my-listings and manage-listings)
