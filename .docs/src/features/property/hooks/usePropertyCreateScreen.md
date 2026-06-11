# File Overview

Screen hook for `PropertyCreateScreen`: page copy, breadcrumb, create-form catalog data, and `PropertyForm` step/navigation state.

**Source:** `src/features/property/hooks/usePropertyCreateScreen.ts`

# Responsibilities

- Resolve `propertyList.propertyCreate` strings (title, subtitle, breadcrumb).
- Build breadcrumb trail: Home → My Listings / Manage Listings (via `resolveListingsMenuPath`) → Create.
- On mount, fetch in parallel:
  - `GET /property-taxonomy`
  - `GET /location-taxonomy`
  - `GET /features?is_active=true`
- When `submission_id` is in the query on **initial mount** (e.g. resume from draft listings), after catalogs load, `GET /property-submissions/{id}` hydrates the form. `draftHydratedForRef` is set only after a successful fetch (not from the URL on mount), so resume still loads data while first draft save + URL sync does not re-fetch.
- Map catalog payloads to `@abdoun/abdoun-library` `PropertyForm` prop shapes via `propertyForm.mapper`.
- Own `activeStep` and wire `onNext`, `onPrevious`, `onStepClick` against `propertyFormSteps`.
- `onDraft` → `POST /property-submissions` when no `submission_id` query; `PATCH /property-submissions/{submissionId}` with `{ action: "save_draft", current_step, last_completed_step, payload }` when resuming a draft. `last_completed_step` comes from `max_reached_step` / hook `maxReachedStep`. On first save, persist `data.submission_id` in the URL query.
- Owner document upload via `useOwnerDocumentUpload` (`context: owner_document`).
- Media step uploads via `usePropertyMediaUpload(submissionId)` — `property_media_image` → `media_files`, `property_document` → `documents`; presign uses `submission_id` (save draft first if missing).
- `onSubmit` → save draft (`PATCH` when `submission_id` exists, else `POST`), then `POST /property-submissions/{id}/submit` with `{ confirm_submit: true }`. Library gates Submit until all terms are accepted (`@abdoun/abdoun-library` 0.1.58+). Success toast + redirect to role listings path.

# API Usage

| Method | Endpoint | Service / mutation |
| --- | --- | --- |
| GET | `/property-taxonomy` | `getPropertyTaxonomy` / `useGetPropertyTaxonomy` |
| GET | `/location-taxonomy` | `getLocationTaxonomy` / `useGetLocationTaxonomy` |
| GET | `/features?is_active=true` | `getPropertyFeatureCatalog` / `useGetPropertyFeatureCatalog` |
| GET | `/property-submissions/{submissionId}` | `getPropertyDraftSubmission` / `useGetPropertyDraftSubmission` (resume draft) |
| POST | `/property-submissions` | `savePropertyDraftSubmission` / `useSavePropertyDraftSubmission` (create draft) |
| PATCH | `/property-submissions/{submissionId}` | `updatePropertyDraftSubmission` / `useUpdatePropertyDraftSubmission` (`action: save_draft`) |
| POST | `/property-submissions/{submissionId}/submit` | `submitPropertyDraftSubmission` / `useSubmitPropertyDraftSubmission` (`confirm_submit: true`) |
| POST | `/uploads/presigned-url` | `requestUploadPresignedUrl` / `uploadOwnerDocument` (owner documents) |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalogItems`, `activeStep`, `maxReachedStep`, `propertyDetails`, `submissionId`, `isCatalogLoading`, `isSubmitting`.
- Reads `submission_id` from `useSearchParams` on load; `router.replace` updates query after first successful draft save.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.
- Host owns `propertyDetails` and `maxReachedStep`; library returns merged values on `onNext` and forward `onStepClick` for persistence.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, `PropertyForm` props (`activeStep`, `maxReachedStep`, `categoryTaxonomy`, `locationTaxonomyForForm`, `featuresAndAmenities`, `propertyDetails`, navigation/upload/submit callbacks, `isDraftLoading`, `isSubmitting`), `isCatalogLoading`, `reloadCreateCatalog`

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onNext(propertyDetails)` | Persist merged step values from library, advance `activeStep`, bump `maxReachedStep` |
| `onPrevious` | Decrement `activeStep` (min 0) |
| `onStepClick(index, step, propertyDetails)` | Persist values when moving forward; set `activeStep` and update `maxReachedStep` |
| `onSubmit` | PATCH/POST draft with `forSubmit` review flags, then POST submit; sets `isSubmitting` on `PropertyForm` |
| `onDraft(propertyDetails)` | Persist library payload (incl. `active_step`), POST or PATCH draft save |
| `onUploadOwnerDocument` | From `useOwnerDocumentUpload` — presign + PUT; returns remote `uri` or `null` on failure |
| `onUploadPropertyMedia` | From `usePropertyMediaUpload` — presign + PUT (`property_media_image`) |
| `onUploadPropertyDocument` | From `usePropertyMediaUpload` — presign + PUT (`property_document`) |

# Dependencies

- `resolveListingsMenuPath` from `profileMenuRoleAccess.ts`
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [propertyForm.mapper.md](../mappers/propertyForm.mapper.md)
- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)
- [propertyForm.constants.md](../constants/propertyForm.constants.md)
