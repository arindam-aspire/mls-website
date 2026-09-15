# File Overview

Builds localized `OwnerInfoConfig.validationMessages` for Create Property.

**Source:** `src/features/property/i18n/propertyCreateOwnerInfo.i18n.ts`

# Responsibilities

- Map `propertyList.propertyCreate.ownerInfo` translation keys into library owner-step validation messages.
- Keys: `ownerNameRequired`, `phoneRequired`, `emailRequired`, `ownerDocumentRequired`.

# Exports

- `buildPropertyCreateOwnerInfoValidationMessages(t)`

# Dependencies

- `@abdoun/abdoun-library` (`OwnerInfoConfig`)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [propertyCreateOwnerInfo.utils.md](../utils/propertyCreateOwnerInfo.utils.md)
