# File Overview

Utilities that adapt the signed-in owner and owner-row state to the `@abdoun/abdoun-library` property form contract.

**Source:** `src/features/property/utils/propertyCreateOwnerInfo.utils.ts`

# Responsibilities

- Build the initial owner row from the authenticated user's name, email, and Jordan phone number.
- Supply an empty `owner_address` compatibility value required by the current library type. The app does not validate or submit this retired field.
- Detect meaningful owner-row content for create-form initialization and dirty-state behavior.
- Resolve owner rows that should be read-only by matching normalized email addresses.
- Build the library `OwnerInfoConfig`, including localized validation messages and document requirements.

# Imports

- `getPhoneInputCountryByCode` for Jordan dialing-code normalization.
- `LoggedInUser` for authenticated profile data.
- `OwnerInfoConfig` and `PropertyFormValues` from `@abdoun/abdoun-library`.

# Exports

- `buildLoggedInOwnerInfoItem`
- `resolveReadOnlyOwnerIndicesByEmail`
- `resolveReadOnlyOwnerIndicesForLoggedInOwner`
- `hasOwnerInfoRowContent`
- `buildPropertyCreateOwnerInfoConfig`

# Flow Description

1. A new owner-role property form receives an owner row built from the signed-in user.
2. The utility separates the Jordan dial code from the local phone number.
3. Existing draft rows are matched by email to determine read-only indices.
4. Owner address remains an empty compatibility-only value and is not part of API persistence.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)

# Notes

The library should remove `owner_address` from `OwnerInfoItem` upstream when the retired field is removed from its form contract. The app-side empty value can then be deleted.
