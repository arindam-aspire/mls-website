# File Overview

Maps `@abdoun/abdoun-library` `PropertyFormValues` ↔ draft submission API payloads (`POST` / `PATCH` / `GET`).

**Source:** `src/features/property/mappers/propertyDraftSubmission.mapper.ts`

# Responsibilities

- `buildPropertyDraftSubmissionPayload` — shared mapped `payload` from form values.
- `buildPropertyDraftSubmissionRequestBody` — `POST` body `{ agency_id?, payload, current_step, last_completed_step }`.
- `buildPropertyDraftSubmissionUpdateRequestBody` — `PATCH` body `{ action: PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION ("save_draft"), agency_id?, current_step, last_completed_step, payload }`.
- `buildPropertySubmissionDirectSubmitRequestBody` — `POST /property-submissions/submit` body `{ route_through_agency, agency_id?, payload, confirm_submit: true }` (no draft id).
- `mapPropertyDraftSubmissionToPropertyFormValues` — reverse map `GET /property-submissions/{id}` `data` into `PropertyFormValues` (incl. `active_step` / `max_reached_step`).
- `current_step` matches `activeStep` (1-based, same as `@abdoun/abdoun-library`).
- Map form sections to API payload keys (`basic_information`, `location`, `owner_information`, etc.).
- Transform values: `listing_purposes[]` (plus legacy single `listing_purpose` when exactly one of `sale`/`rent`), `area_id` (single-select; first `area_ids` hydrates), lat/lng, identification fields (`parcel_number`, `plot_number`, `building_number`, `apartment_number`, `identification_fields.floor_number`), host `show_location`, official DLS codes and names (`gov_code`/`gov_name` … `sect_code`/`sect_name`) on both `location` and `property_details`, `year_built` (legacy age buckets stay in `property_age` and are never sent as years), named sale/rent prices, `owner_id` / `owner_mode`, `amenities.feature_ids`, and image `is_primary` / `display_order`. For **Land**, `parcel_number` is also written to `identification_fields.parcel_number` so draft GET/PATCH round-trips when the Location model omits the first-class key. Hydrate prefers `location.parcel_number`, then `identification_fields.parcel_number`.
- Persist Furnishing Status as a master-table ID when the selected catalog value is numeric (`payload.property_details.furnishing_status`). **Floor** (`floor_level` / `floor`) is omitted from Property Information: outbound payloads send `null`, and hydrate always sets `floor_level: null`. Persist DLS Land Type as `payload.property_details.land_type_id` (Residential/Commercial only; cleared for Land). Hydrate Land Type from `land_type_id` / `land_type` / `landType` onto a host-extended `property_details` object (cast until library `PropertyDetailsFormValues` includes the field). If that value is not in the dropdown catalog, it is appended so the select can display it.
- Do **not** send `permit_number` / DLD on new payloads. Old drafts that still contain `permit_number` hydrate without showing the field (`legacyFields.permit_dld_number: false`).
- Persist the Built-up Area decimal value as square metres. Outbound payloads always send `"SQM"`; legacy `"SQFT"` draft values are converted with `0.09290304` on hydrate and on save.
- Follow the v0.1.89 `PropertyDetailsFormValues` contract: map `guard_name` and merge/split `guard_country_code` plus `guard_phone_number` for API persistence.
- Exclude the retired `owner_address` field from both outbound owner information and v0.1.89 draft hydration.
- Include non-empty `property_details.reference_number` on outbound draft/submit payloads so PATCH does not wipe a server-generated value already shown in the form. Empty/missing form values omit the field (backend still owns first generation). Hydrate always maps the server value for display.
- Round-trip `pricing.additional_prices` on hydrate and outbound save (omit empty map).
- Map `selected_amenities` + `feature_ids` (library stores both FEATURE and AMENITY selections in `amenities`) ↔ API `amenities.feature_ids` (catalog `id` values) within the taxonomy-filtered catalog.
- Persist media/document `url` via `resolvePersistableFileUri` (stable `file_url` / `object_key`). Hydrate form `uri` from persist keys and `previewUri` from `signed_read_url` / `thumb_url` / displayable `url` so Media and Review & Submit share the same thumbnail src (`previewUri ?? uri`).
- Map `terms_acceptance` ↔ `review_submit` on hydrate/save; draft saves default flags to `false` unless form values are present; `{ forSubmit: true }` sets all review flags `true` before submit.
- `pricing.currency` from `BuildPropertyDraftSubmissionPayloadOptions.currency` (via `toPropertyDraftSubmissionCurrency` for agency display currency → API `"JOD"`), defaulting to `"JOD"`; hydrate that saved currency into all three v0.1.89 pricing currency selectors; map uploaded media files into `media_documents.images` and `media_documents.videos`, and hydrate draft `images` + `videos` back into `media_upload.media_files`.
- Restrict media mapping and draft hydration to JPG/JPEG, PNG, WebP, GIF, MP4, and MOV; restrict property-document mapping and hydration to PDF, DOC, and DOCX. Unsupported legacy entries are not restored or emitted in draft/submit payloads.
- Map host-owned `routeThroughAgency` to top-level `route_through_agency` on create-draft, update-draft, and direct-submit bodies. Preserve explicit `agencyId: null` so disabling routing clears a previously selected draft agency.

# Exports

- `BuildPropertyDraftSubmissionPayloadOptions` (`forSubmit?`, `agencyId?`, `currency?: PropertyDraftSubmissionCurrency`, `arrangement?`)
- `toPropertyDraftSubmissionCurrency(agencyCurrency?)` — maps agency display currency to draft-submission pricing (`"JOD"` only)
- `getPropertyFormShowLocation(propertyDetails)` — reads the host-owned boolean and defaults missing values to `false`
- `extractPropertyFormDls(propertyDetails)` — reads official DLS codes and names from host location state
- `withPropertyFormHostLocationFields(propertyDetails, { showLocation, dls?, identification? })` — merges Show Location plus DLS onto library-emitted Location values; optional `identification` keeps host DLS text fields when the library step payload is empty
- `withPropertyFormShowLocation(propertyDetails, showLocation)` — merges the boolean into Location values without dropping library-owned fields (preserves current DLS)
- `buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities, options?)`
- `buildPropertyDraftSubmissionRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertyDraftSubmissionUpdateRequestBody(propertyDetails, featuresAndAmenities, currentStep, lastCompletedStep, options?)`
- `buildPropertySubmissionDirectSubmitRequestBody(propertyDetails, featuresAndAmenities, options?)`
- `mapPropertyDraftSubmissionToPropertyFormValues(data, featuresAndAmenities, formOptionsCatalog?)`

# Flow Description

1. New forms seed `location_insert.show_location` as `false`.
2. Draft/create/update payload builders always include the resolved boolean under `payload.location.show_location`.
3. Draft hydration maps a saved value back into `location_insert`; absent legacy values become `false`.
4. Reference Number: after draft save the host merges `payload.property_details.reference_number` into form state; outbound payloads re-send a non-empty value so later PATCH does not clear it. Empty form values omit the field so the backend can generate on first save.
5. Built-up Area draft hydration restores both the entered value and selected unit; legacy drafts without a unit default to `"SQM"`.
6. Floor (`floor_level`) is not hydrated or required — Property Information no longer shows the Floor dropdown.

# Dependencies

- [propertyCreate.constants.md](../constants/propertyCreate.constants.md) — `PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION` for PATCH `action`
- [propertyDraftSubmission.types.md](../types/propertyDraftSubmission.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
