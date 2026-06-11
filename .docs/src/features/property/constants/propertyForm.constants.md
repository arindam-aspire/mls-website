# File Overview

Shared initial values for the create-property `PropertyForm`.

**Source:** `src/features/property/constants/propertyForm.constants.ts`

# Responsibilities

- Export `INITIAL_PROPERTY_FORM_VALUES` — empty `PropertyFormProps["propertyDetails"]` object used as the library form seed (all steps optional).
- Export `INITIAL_PROPERTY_FORM_ACTIVE_STEP` (`1`) — default step index; matches library and API `current_step` (1-based).

# Exports

- `INITIAL_PROPERTY_FORM_VALUES`
- `INITIAL_PROPERTY_FORM_ACTIVE_STEP`

# Dependencies

- `@abdoun/abdoun-library` (`PropertyFormValues`)
