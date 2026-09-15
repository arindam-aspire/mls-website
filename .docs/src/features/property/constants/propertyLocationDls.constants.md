# File Overview

Level tokens and the empty DLS selection for Add Property cascading selects.

**Source:** `src/features/property/constants/propertyLocationDls.constants.ts`

# Responsibilities

- List the five DLS levels in dependency order.
- List code/name payload keys (`gov_code`, `gov_name`, …).
- Provide `EMPTY_PROPERTY_LOCATION_DLS` for clearing descendants when a parent changes.

# Exports

- `PROPERTY_LOCATION_DLS_LEVELS`
- `PROPERTY_LOCATION_DLS_CODE_KEYS`
- `PROPERTY_LOCATION_DLS_NAME_KEYS`
- `PROPERTY_LOCATION_DLS_FIELD_KEYS`
- `EMPTY_PROPERTY_LOCATION_DLS`

# Dependencies

- [dls.types.md](../types/dls.types.md)
- [usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
