# File Overview

Normalizes property list card payloads for `@abdoun/abdoun-library` `PropertyCardList` / similar cards.

**Source:** `src/features/property/utils/normalizePropertyListingStatus.ts`

# Responsibilities

- Coerce `status` string → `PropertyListingStatus` via `createListingStatus`.
- Normalize `title` string or partial locale object → `{ en, ar, esp, fr }`.
- Merge optional API `currency` into `price` as `"JOD 12,000"` so library `formatPrice` can display amount + currency.
- Coerce `currency` to `string | null` (`coerceListingCurrencyCode`) before passing to cards — library `0.1.86+` calls `currency?.trim()` and crashes on non-strings.
- Coerce `agency` / `agent` **`null` → omitted** and require library-compatible shapes (`agency_id`+`agency_name`, `id`+`name`) so `PropertyCardList` typechecks.

# Exports

| Export | Purpose |
| --- | --- |
| `normalizePropertyListingStatus` | Status slug → library status object |
| `formatListingPriceWithCurrency` | `price` + `currency` → card `price` string |
| `normalizePropertyListing` | Status + title + price normalization used by list / favourites / recent / similar |

# Notes

- **Grid cards** still omit title in abdoun-library `@0.1.85` — title shows on **list** layout only until the library GridCard change ships (see contact / product notes).
- Prefer upgrading `@abdoun/abdoun-library` for grid title + locale-aware title resolution rather than forking card UI in mls_website.
