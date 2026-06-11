# File Overview

Maps `@abdoun/abdoun-library` `PropertyFormValues` to `PropertyDraftSubmissionRequestBody` for `POST /property-submissions`.

**Source:** `src/features/property/mappers/propertyDraftSubmission.mapper.ts`

# Responsibilities

- `buildPropertyDraftSubmissionPayload` — shared mapped `payload` from form values.
- `buildPropertyDraftSubmissionRequestBody` — `POST` body `{ payload, current_step }`.
- `buildPropertyDraftSubmissionUpdateRequestBody` — `PATCH` body `{ action: "save_draft", current_step, payload }`.
- `current_step` matches `activeStep` (1-based, same as `@abdoun/abdoun-library`).
- Map form sections to API payload keys (`basic_information`, `location`, `owner_information`, etc.).
- Transform values: `area_ids[0]` → `area_id`, `permit_dld_number` → `permit_number`, `total_floor` → `total_floors`, numeric strings → numbers, owner phone concat, media `name`/`uri` → `file_name`/`url`.
- Map `selected_amenities` to 1-based `feature_ids` in taxonomy-filtered catalog order (matches library stepper catalog).
- Default `review_submit` booleans to `false` on draft; `pricing.currency` to `"JOD"`; `media_documents.videos` to `[]`.

# Exports

- `buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities)`
- `buildPropertyDraftSubmissionRequestBody(propertyDetails, featuresAndAmenities, currentStep)`
- `buildPropertyDraftSubmissionUpdateRequestBody(propertyDetails, featuresAndAmenities, currentStep)`

# Dependencies

- [propertyDraftSubmission.types.md](../types/propertyDraftSubmission.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
