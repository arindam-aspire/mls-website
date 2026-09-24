# File Overview

TypeScript request-body shapes for property **draft submission** (create / save draft). Maps from `@abdoun/abdoun-library` `PropertyFormValues` at the mapper/service layer.

**Source:** `src/features/property/types/propertyDraftSubmission.types.ts`

# Responsibilities

- Define nested submission sections under `payload`: `basic_information`, `location`, `owner_information`, `property_details`, `pricing`, `amenities`, `media_documents`, `review_submit`.
- Document field renames and transforms vs `PropertyForm` (e.g. `listing_purposes[]`, `area_id`, lat/lng, identification fields, `year_built`, named prices, `owner_id`). `permit_number` is accepted only when hydrating old drafts.
- Export `PropertyDraftSubmissionPayload` (mapped form data; **every key optional** for partial drafts) and top-level request/response routing fields (`route_through_agency`, `agency_id`).

# Exports

| Type | Purpose |
| --- | --- |
| `PropertyDraftSubmissionListingPurpose` | `"sale"` \| `"rent"` |
| `PropertyDraftSubmissionCurrency` | `AgencyCurrency` (`"JOD"` \| `"USD"`) |
| `PropertyDraftMasterOptionValue` | Master-table id/slug or nested `{ id }` used by furnishing and floor |
| `PropertyDraftSubmissionBasicInformation` | `listing_purposes[]`, optional legacy `listing_purpose`, title, description, taxonomy ids |
| `PropertyDraftSubmissionLocation` | City, single `area_id`, lat/lng, identification fields, official DLS codes/names (`gov_code` … `sect_name`), `show_location` |
| `PropertyDraftSubmissionOwnerInformation` | `owner_id`, `owner_mode`, owners with merged phone, `nationality`, `ssi`, documents |
| `PropertyDraftSubmissionPropertyDetails` | Bedrooms, Built-up Area, `year_built`, furnishing/floor master IDs, completion; `permit_number` hydrate-only |
| `PropertyDraftSubmissionPricing` | Named furnished/unfurnished sale and rent prices plus legacy `price` |
| `PropertyDraftSubmissionAmenities` | `feature_ids` (feature catalog ids) |
| `PropertyDraftSubmissionMediaDocuments` | Images, videos, documents, urls |
| `PropertyDraftSubmissionReviewSubmit` | Terms / privacy / display / fees flags |
| `PropertyDraftSubmissionPayload` | Mapped submission data (`payload` object) |
| `PropertyDraftSubmissionRequestBody` | `{ route_through_agency, agency_id?, payload, current_step, last_completed_step }` POST body |
| `PropertyDraftSubmissionUpdateRequestBody` | `{ action: "save_draft", route_through_agency, agency_id?, current_step, last_completed_step, payload }` PATCH body |
| `PropertyDraftSubmissionData` | Draft response including `route_through_agency`, `agency_id`, steps, status, optional `can_edit` / `can_edit_submission`, and payload |
| `PropertyDraftSubmissionResponse` | `{ success, message, data: PropertyDraftSubmissionData, error, meta }` |

# Notes

- Request shape: `{ "payload": { … }, "current_step": 1, "last_completed_step": 1 }` on the first form step — `current_step` matches `activeStep`; `last_completed_step` matches `max_reached_step` (1-based, same as the library).
- Draft `payload`: omit any section or field the user has not filled yet; nested objects and array items also use optional keys.
- `payload.location.show_location` is sent on create/update. New and legacy drafts default it to `false`; saved drafts hydrate the stored value.
- Draft payloads retain the entered Built-up Area value and always persist `"SQM"`. Legacy `"SQFT"` values are converted with `1 sq. ft. = 0.09290304 sq. m.`
- `route_through_agency` is a top-level boolean on create/update/direct-submit requests and defaults to `false`; `agency_id` is `null` when routing is off and required by the UI when routing is on.
- Optional GET flags `can_edit` / `can_edit_submission` override client editability rules when present (`false` locks; `true` unlocks; omitted → status/role rules).
- `media_documents.images` carries uploaded property images; `media_documents.videos` carries uploaded property videos. GET payloads may include `signed_read_url` / `thumb_url` / `object_key` for preview vs persist; outbound save sends only the persist `url`.
- `review_submit` booleans default to `false` on draft unless the UI sets them explicitly.
- Mapper from `PropertyFormValues` is not in this file; add under `src/features/property/mappers/` when wiring the API.

# Dependencies

- [property.types.md](./property.types.md) — shared property API types
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md) — form state source
