# File Overview

Step id ↔ `PropertyFormValues` section map for Create Property dirty tracking.

**Source:** `src/features/property/constants/propertyCreateFormSteps.constants.ts`

# Responsibilities

- Derive step ids from library `propertyFormSteps`.
- Map each step id to its form section key used by dirty-state snapshots.

# Exports

- `PropertyCreateFormStepId`
- `PROPERTY_CREATE_FORM_STEP_SECTIONS` — `setup`→`basic_info`, `location`→`location_insert`, …, `finalize`→`terms_acceptance`
- `PROPERTY_CREATE_FORM_STEP_IDS` — ordered list of step ids

# Dependencies

- `@abdoun/abdoun-library` (`propertyFormSteps`, `PropertyFormValues`)
- [propertyCreateDirtyState.utils.md](../utils/propertyCreateDirtyState.utils.md)
- [usePropertyCreateUnsavedChanges.md](../hooks/usePropertyCreateUnsavedChanges.md)
