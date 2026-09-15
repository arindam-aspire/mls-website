# File Overview

Route/query constants for the property create flow.

**Source:** `src/features/property/constants/propertyCreate.constants.ts`

# Exports

- `PROPERTY_CREATE_SUBMISSION_ID_PARAM` — `"submission_id"` query key on `/property-create` (resume draft)
- `PROPERTY_CREATE_AGENCY_ID_PARAM` — `"agency_id"` query key when an owner selects an agency before create
- `PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION` — `"save_draft"` PATCH action for draft updates

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [useAddPropertyEntry.md](../hooks/useAddPropertyEntry.md) (if present)
