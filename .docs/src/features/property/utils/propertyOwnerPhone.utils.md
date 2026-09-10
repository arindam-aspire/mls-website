# File Overview

Shared parse/build helpers for owner and guard phone values used by draft mapping and owner search.

**Source:** `src/features/property/utils/propertyOwnerPhone.utils.ts`

# Responsibilities

- `buildOwnerPhone(countryCode, localNumber)` — concatenate for API `phone` / `guard_phone_number`.
- `parseOwnerPhoneForForm(phone)` — split stored phone into library `country_code` + `phone_number`.
- `toOptionalTrimmedString` — omit empty strings from payloads.

# Exports

- `buildOwnerPhone`
- `parseOwnerPhoneForForm`
- `toOptionalTrimmedString`

# Dependencies

- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)
- [propertyOwnerSearch.mapper.md](../mappers/propertyOwnerSearch.mapper.md)
