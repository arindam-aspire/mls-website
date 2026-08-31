# File Overview

Maps `@abdoun/abdoun-library` `PropertyFormValues` ↔ draft submission API payloads (`POST` / `PATCH` / `GET`).

**Source:** `src/features/property/mappers/propertyDraftSubmission.mapper.ts`

# Responsibilities

- `buildPropertyDraftSubmissionPayload` — shared mapped `payload` from form values.
- `buildPropertyDraftSubmissionRequestBody` — `POST` body `{ agency_id?, payload, current_step, last_completed_step }`.
- `buildPropertyDraftSubmissionUpdateRequestBody` — `PATCH` body `{ action: "save_draft", agency_id?, current_step, last_completed_step, payload }`.
- `buildPropertySubmissionDirectSubmitRequestBody` — `POST /property-submissions/submit` body `{ route_through_agency, agency_id?, payload, confirm_submit: true }` (no draft id).
- `mapPropertyDraftSubmissionToPropertyFormValues` — reverse map `GET /property-submissions/{id}` `data` into `PropertyFormValues` (incl. `active_step` / `max_reached_step`).
- `current_step` matches `activeStep` (1-based, same as `@abdoun/abdoun-library`).
- Map form sections to API payload keys (`basic_information`, `location`, `owner_information`, etc.).
- Transform values: `area_ids[0]` → `area_id`, preserve the host extension `location_insert.show_location` as `payload.location.show_location`, `permit_dld_number` → `permit_number`, `total_floor` → `total_floors`, numeric strings → numbers, owner `country_code`+`phone_number` → `phone`, `social_security_id` → `ssi`, `nationality` → `nationality`, property-details `guard_country_code`+`guard_phone_number` → `guard_phone_number`, media `name`/`uri` → `file_name`/`url`, and split `media_upload.media_files` into API `images` vs `videos`.
- Exclude retired `owner_address` from outbound `owner_information`; inbound draft hydration no longer seeds it on owner rows.
- Exclude `property_details.reference_number` from create, draft-update, and direct-submit request payloads. The backend owns generation and preservation of this value; the reverse mapper still hydrates the server value for display.
- Map `selected_amenities` + `feature_ids` (library stores both FEATURE and AMENITY selections in `amenities`) ↔ API `amenities.feature_ids` (catalog `id` values) within the taxonomy-filtered catalog.
- Map `terms_acceptance` ↔ `review_submit` on hydrate/save; draft saves default flags to `false` unless form values are present; `{ forSubmit: true }` sets all review flags `true` before submit.
- `pricing.currency` from `BuildPropertyDraftSubmissionPayloadOptions.currency` (via `toPropertyDraftSubmissionCurrency` for agency display currency → API `"JOD"`), defaulting to `"JOD"`; map uploaded media files into `media_documents.images` and `media_documents.videos`, and hydrate draft `images` + `videos` back into `media_upload.media_files`.
- Restrict media mapping and draft hydration to JPG/JPEG, PNG, WebP, GIF, MP4, and MOV; restrict property-document mapping and hydration to PDF, DOC, and DOCX. Unsupported legacy entries are not restored or emitted in draft/submit payloads.
- Map host-owned `routeThroughAgency` to top-level `route_through_agency` on create-draft, update-draft, and direct-submit bodies. Preserve explicit `agencyId: null` so disabling routing clears a previously selected draft agency.

# Exports

- `BuildPropertyDraftSubmissionPayloadOptions` (`forSubmit?`, `agencyId?`, `currency?: PropertyDraftSubmissionCurrency`)
- `toPropertyDraftSubmissionCurrency(agencyCurrency?)` — maps agency display currency to draft-submission pricing (`"JOD"` only)
- `getPropertyFormShowLocation(propertyDetails)` — reads the host-owned boolean and defaults missing values to `false`
- `withPropertyFormShowLocation(propertyDetails, showLocation)` — merges the boolean into Location values without dropping library-owned fields
- `buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities, options?)`
- `buildPropertyDraftSubmissionRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertyDraftSubmissionUpdateRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertySubmissionDirectSubmitRequestBody(propertyDetails, featuresAndAmenities, options?)`
- `mapPropertyDraftSubmissionToPropertyFormValues(data, featuresAndAmenities)`

# Flow Description

1. New forms seed `location_insert.show_location` as `false`.
2. Draft/create/update payload builders always include the resolved boolean under `payload.location.show_location`.
3. Draft hydration maps a saved value back into `location_insert`; absent legacy values become `false`.
4. Reference Number is response-only in the frontend mapping: API responses populate the form display, while outbound payloads cannot generate or overwrite it.

# Dependencies

- [propertyDraftSubmission.types.md](../types/propertyDraftSubmission.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
