# File Overview

Shared initial values for the create-property `PropertyForm`.

**Source:** `src/features/property/constants/propertyForm.constants.ts`

# Responsibilities

- Export `INITIAL_PROPERTY_FORM_VALUES` — library form seed with an empty Location section, app-owned `show_location: false`, and complete Property Details defaults required by v0.1.89.
- Default the split Built-up Area control to `built_up_area_unit: "SQM"`; initialize the decimal value as an empty string.
- Initialize guard contact fields required by the library contract, using Jordan (`+962`) as the empty phone row's country code.
- Export `INITIAL_PROPERTY_FORM_ACTIVE_STEP` (`1`) — default step index; matches library and API `current_step` (1-based).
- Export `PROPERTY_FORM_LOCATION_STEP` — derives the 1-based Location index from the library step catalog.
- Export `PROPERTY_FORM_FINALIZE_STEP` — derives the 1-based Review & Submit index used to mount Agency Routing.

# Exports

- `INITIAL_PROPERTY_FORM_VALUES`
- `INITIAL_PROPERTY_FORM_ACTIVE_STEP`
- `PROPERTY_FORM_LOCATION_STEP`
- `PROPERTY_FORM_FINALIZE_STEP`

# Dependencies

- `@abdoun/abdoun-library` (`PropertyFormValues`)
