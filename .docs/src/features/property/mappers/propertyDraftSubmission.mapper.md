# File Overview

Maps `@abdoun/abdoun-library` `PropertyFormValues` ↔ draft submission API payloads (`POST` / `PATCH` / `GET`).

**Source:** `src/features/property/mappers/propertyDraftSubmission.mapper.ts`

# Responsibilities

- `buildPropertyDraftSubmissionPayload` — shared mapped `payload` from form values.
- `buildPropertyDraftSubmissionRequestBody` — `POST` body `{ payload, current_step, last_completed_step }`.
- `buildPropertyDraftSubmissionUpdateRequestBody` — `PATCH` body `{ action: "save_draft", current_step, last_completed_step, payload }`.
- `buildPropertySubmissionDirectSubmitRequestBody` — `POST /property-submissions/submit` body `{ payload, confirm_submit: true }` (no draft id).
- `mapPropertyDraftSubmissionToPropertyFormValues` — reverse map `GET /property-submissions/{id}` `data` into `PropertyFormValues` (incl. `active_step` / `max_reached_step`).
- `current_step` matches `activeStep` (1-based, same as `@abdoun/abdoun-library`).
- Map form sections to API payload keys (`basic_information`, `location`, `owner_information`, etc.).
- Transform values: `area_ids[0]` → `area_id`, `permit_dld_number` → `permit_number`, `total_floor` → `total_floors`, numeric strings → numbers, owner `country_code`+`phone_number` → `phone`, `social_security_id` → `ssi`, `owner_address` → `address`, `nationality` → `nationality`, media `name`/`uri` → `file_name`/`url`.
- Map `selected_amenities` (library uses feature `name`) ↔ API `feature_ids` (catalog `id` values such as `47`, `54`, `60`) within the taxonomy-filtered catalog.
- Map `terms_acceptance` ↔ `review_submit` on hydrate/save; draft saves default flags to `false` unless form values are present; `{ forSubmit: true }` sets all review flags `true` before submit.
- `pricing.currency` to `"JOD"`; `media_documents.videos` to `[]`.

# Exports

- `BuildPropertyDraftSubmissionPayloadOptions` (`forSubmit?`)
- `buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities, options?)`
- `buildPropertyDraftSubmissionRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertyDraftSubmissionUpdateRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertySubmissionDirectSubmitRequestBody(propertyDetails, featuresAndAmenities, options?)`
- `mapPropertyDraftSubmissionToPropertyFormValues(data, featuresAndAmenities)`

# Dependencies

- [propertyDraftSubmission.types.md](../types/propertyDraftSubmission.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
