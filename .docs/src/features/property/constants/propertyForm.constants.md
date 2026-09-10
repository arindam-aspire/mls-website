# File Overview

Shared initial values for the create-property `PropertyForm`.

**Source:** `src/features/property/constants/propertyForm.constants.ts`

# Responsibilities

- Export `INITIAL_PROPERTY_FORM_VALUES` — library form seed for v0.1.90: `listing_purposes: ["sale"]`, single `area_id`, lat/lng, identification fields, `year_built`, named prices, `owner_mode: "create"`, and host `show_location: false`.
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
