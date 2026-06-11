# File Overview

TypeScript request-body shapes for property **draft submission** (create / save draft). Maps from `@abdoun/abdoun-library` `PropertyFormValues` at the mapper/service layer.

**Source:** `src/features/property/types/propertyDraftSubmission.types.ts`

# Responsibilities

- Define nested submission sections under `payload`: `basic_information`, `location`, `owner_information`, `property_details`, `pricing`, `amenities`, `media_documents`, `review_submit`.
- Document field renames and transforms vs `PropertyForm` (e.g. `area_ids[0]` → `area_id`, `permit_dld_number` → `permit_number`, `total_floor` → `total_floors`).
- Export `PropertyDraftSubmissionPayload` (mapped form data; **every key optional** for partial drafts) and `PropertyDraftSubmissionRequestBody` (`{ payload, current_step }`).

# Exports

| Type | Purpose |
| --- | --- |
| `PropertyDraftSubmissionListingPurpose` | `"sale"` \| `"rent"` |
| `PropertyDraftSubmissionCurrency` | `"JOD"` |
| `PropertyDraftSubmissionBasicInformation` | Title, description, taxonomy ids |
| `PropertyDraftSubmissionLocation` | City, first area, address |
| `PropertyDraftSubmissionOwnerInformation` | Owners with merged phone and document urls |
| `PropertyDraftSubmissionPropertyDetails` | Bedrooms, area, permit, etc. |
| `PropertyDraftSubmissionPricing` | Numeric price fields + currency |
| `PropertyDraftSubmissionAmenities` | `feature_ids` (1-based amenity option indices) |
| `PropertyDraftSubmissionMediaDocuments` | Images, empty `videos`, documents, urls |
| `PropertyDraftSubmissionReviewSubmit` | Terms / privacy / display / fees flags |
| `PropertyDraftSubmissionPayload` | Mapped submission data (`payload` object) |
| `PropertyDraftSubmissionRequestBody` | `{ payload, current_step }` POST body (create) |
| `PropertyDraftSubmissionUpdateRequestBody` | `{ action: "save_draft", current_step, payload }` PATCH body |
| `PropertyDraftSubmissionData` | Draft save payload: `submission_id`, `status`, `current_step`, `step_completion`, `payload` |
| `PropertyDraftSubmissionResponse` | `{ success, message, data: PropertyDraftSubmissionData, error, meta }` |

# Notes

- Request shape: `{ "payload": { … }, "current_step": 1 }` on the first form step — `current_step` matches `activeStep` (1-based, same as the library).
- Draft `payload`: omit any section or field the user has not filled yet; nested objects and array items also use optional keys.
- `videos` is typed as `PropertyDraftSubmissionMediaVideo[]` but the app always sends `[]` until video upload exists.
- `review_submit` booleans default to `false` on draft unless the UI sets them explicitly.
- Mapper from `PropertyFormValues` is not in this file; add under `src/features/property/mappers/` when wiring the API.

# Dependencies

- [property.types.md](./property.types.md) — shared property API types
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md) — form state source
