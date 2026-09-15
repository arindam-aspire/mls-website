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
- Transform values: `listing_purposes[]` (plus legacy single `listing_purpose` when exactly one of `sale`/`rent`), `area_id` (single-select; first `area_ids` hydrates), lat/lng, identification fields, host `show_location`, official DLS codes and names (`gov_code`/`gov_name` … `sect_code`/`sect_name`) on both `location` and `property_details`, `year_built` (legacy age buckets stay in `property_age` and are never sent as years), named sale/rent prices, `owner_id` / `owner_mode`, `amenities.feature_ids`, and image `is_primary` / `display_order`.
- Persist Furnishing Status and Floor as master-table IDs when the selected catalog value is numeric (`payload.property_details.furnishing_status`, `payload.property_details.floor_level`, and `payload.property_details.floor` for GET compatibility). Hydrate Floor from GET `floor` first (also `floor_id` / `floor_level`), including nested `{ id, name }` objects and payload/data-level `floor`. If that value is not in the dropdown catalog, it is appended so the Floor select can display it.
- Do **not** send `permit_number` / DLD on new payloads. Old drafts that still contain `permit_number` hydrate without showing the field (`legacyFields.permit_dld_number: false`).
- Persist the Built-up Area decimal value as square metres. Outbound payloads always send `"SQM"`; legacy `"SQFT"` draft values are converted with `0.09290304` on hydrate and on save.
- Follow the v0.1.89 `PropertyDetailsFormValues` contract: map `guard_name` and merge/split `guard_country_code` plus `guard_phone_number` for API persistence.
- Exclude the retired `owner_address` field from both outbound owner information and v0.1.89 draft hydration.
- Include non-empty `property_details.reference_number` on outbound draft/submit payloads so PATCH does not wipe a server-generated value already shown in the form. Empty/missing form values omit the field (backend still owns first generation). Hydrate always maps the server value for display.
- Round-trip `pricing.additional_prices` on hydrate and outbound save (omit empty map).
- Map `selected_amenities` + `feature_ids` (library stores both FEATURE and AMENITY selections in `amenities`) ↔ API `amenities.feature_ids` (catalog `id` values) within the taxonomy-filtered catalog.
- Map `terms_acceptance` ↔ `review_submit` on hydrate/save; draft saves default flags to `false` unless form values are present; `{ forSubmit: true }` sets all review flags `true` before submit.
- `pricing.currency` from `BuildPropertyDraftSubmissionPayloadOptions.currency` (via `toPropertyDraftSubmissionCurrency` for agency display currency → API `"JOD"`), defaulting to `"JOD"`; hydrate that saved currency into all three v0.1.89 pricing currency selectors; map uploaded media files into `media_documents.images` and `media_documents.videos`, and hydrate draft `images` + `videos` back into `media_upload.media_files`.
- Restrict media mapping and draft hydration to JPG/JPEG, PNG, WebP, GIF, MP4, and MOV; restrict property-document mapping and hydration to PDF, DOC, and DOCX. Unsupported legacy entries are not restored or emitted in draft/submit payloads.
- Map host-owned `routeThroughAgency` to top-level `route_through_agency` on create-draft, update-draft, and direct-submit bodies. Preserve explicit `agencyId: null` so disabling routing clears a previously selected draft agency.

# Exports

- `BuildPropertyDraftSubmissionPayloadOptions` (`forSubmit?`, `agencyId?`, `currency?: PropertyDraftSubmissionCurrency`)
- `toPropertyDraftSubmissionCurrency(agencyCurrency?)` — maps agency display currency to draft-submission pricing (`"JOD"` only)
- `getPropertyFormShowLocation(propertyDetails)` — reads the host-owned boolean and defaults missing values to `false`
- `extractPropertyFormDls(propertyDetails)` — reads official DLS codes and names from host location state
- `withPropertyFormHostLocationFields(propertyDetails, { showLocation, dls? })` — merges Show Location plus DLS onto library-emitted Location values
- `withPropertyFormShowLocation(propertyDetails, showLocation)` — merges the boolean into Location values without dropping library-owned fields (preserves current DLS)
- `buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities, options?)`
- `buildPropertyDraftSubmissionRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertyDraftSubmissionUpdateRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertySubmissionDirectSubmitRequestBody(propertyDetails, featuresAndAmenities, options?)`
- `getDraftFloorValue(data)` — reads GET `floor` from `property_details`, `payload`, or `data`
- `mapPropertyDraftSubmissionToPropertyFormValues(data, featuresAndAmenities, formOptionsCatalog?)`

# Flow Description

1. New forms seed `location_insert.show_location` as `false`.
2. Draft/create/update payload builders always include the resolved boolean under `payload.location.show_location`.
3. Draft hydration maps a saved value back into `location_insert`; absent legacy values become `false`.
4. Reference Number: after draft save the host merges `payload.property_details.reference_number` into form state; outbound payloads re-send a non-empty value so later PATCH does not clear it. Empty form values omit the field so the backend can generate on first save.
5. Built-up Area draft hydration restores both the entered value and selected unit; legacy drafts without a unit default to `"SQM"`.
6. Floor hydrates from GET `floor` (id, slug, name, or nested object). If that value is missing from the Floor dropdown options, it is added so the select can show it.

# Dependencies

- [propertyDraftSubmission.types.md](../types/propertyDraftSubmission.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
