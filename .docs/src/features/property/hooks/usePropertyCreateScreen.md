# File Overview

Screen hook for `PropertyCreateScreen`: page copy, breadcrumb, create-form catalog data, and `PropertyForm` step/navigation state.

**Source:** `src/features/property/hooks/usePropertyCreateScreen.ts`

# Responsibilities

- Resolve `propertyList.propertyCreate` strings (title, subtitle, breadcrumb).
- Build breadcrumb trail: Home → My Listings / Manage Listings (via `resolveListingsMenuPath`) → Create.
- On mount, fetch in parallel:
  - `GET /property-taxonomy`
  - `GET /location-taxonomy`
  - `GET /features?is_active=true` (single catalog for both Features and Amenities; `feature_group` `FEATURE` \| `AMENITY`)
- When `submission_id` is in the query on **initial mount** (e.g. resume from draft listings), after catalogs load, `GET /property-submissions/{id}` hydrates the form. `draftHydratedForRef` is set only after a successful fetch (not from the URL on mount), so resume still loads data while first draft save + URL sync does not re-fetch.
- From draft `status`: `submitted` → `canEditSubmission: false` (read-only `PropertyForm`); `rejected` → `rejectionReason` from `review_reason` (library resubmit alert + Resubmit label).
- Map catalog payloads to `@abdoun/abdoun-library` `PropertyForm` prop shapes via `propertyForm.mapper`.
- Own `activeStep` and wire `onNext`, `onPrevious`, `onStepClick` against `propertyFormSteps`.
- `onDraft` → `POST /property-submissions` when no `submission_id` query; `PATCH /property-submissions/{submissionId}` when resuming. Returns `boolean` success for unsaved-changes modal. Clears dirty baseline on success.
- **Unsaved-changes baseline:** After catalog load (and draft hydration when `submission_id` is present), the dirty baseline is taken from the library `PropertyForm` **live payload** (deferred one tick), not from the API mapper output — avoids false “unsaved changes” when resuming a draft without edits.
- **Unsaved changes:** delegates to [usePropertyCreateUnsavedChanges.md](./usePropertyCreateUnsavedChanges.md) — per-step dirty tracking, navigation guard + link/back/keyboard refresh interception, custom modal (**Save as Draft** / **Discard** / **Cancel**). Tracks `propertyDetails` from the screen hook until `@abdoun/abdoun-library` ships live payload callbacks.
- Owner document upload via `useOwnerDocumentUpload` (`context: owner_document`).
- **Owner step (`ownerInfoConfig`):** requires at least one uploaded document per owner (Next disabled until valid); localized validation via `propertyList.propertyCreate.ownerInfo`; owner-role users get auto-filled first owner on new create and read-only name/phone/email on rows matching their account email (draft resume included). See [propertyCreateOwnerInfo.utils.md](../utils/propertyCreateOwnerInfo.utils.md).
- Media step uploads via `usePropertyMediaUpload(submissionId)` — `property_media_image` → `media_files`, `property_document` → `documents`; presign uses `submission_id` (save draft first if missing).
- `onSubmit` → when **no** `submission_id`: `POST /property-submissions/submit` with `{ payload, confirm_submit: true }` (full form mapped via `buildPropertySubmissionDirectSubmitRequestBody`). When `submission_id` exists: `PATCH` draft with `forSubmit` flags, then `POST /property-submissions/{id}/submit` with `{ confirm_submit: true }`. Library gates Submit until all terms are accepted. Success toast + redirect to role listings path.

# API Usage

| Method | Endpoint | Service / mutation |
| --- | --- | --- |
| GET | `/property-taxonomy` | `getPropertyTaxonomy` / `useGetPropertyTaxonomy` |
| GET | `/location-taxonomy` | `getLocationTaxonomy` / `useGetLocationTaxonomy` |
| GET | `/features?is_active=true` | `getPropertyFeatureCatalog` / `useGetPropertyFeatureCatalog` |
| GET | `/property-submissions/{submissionId}` | `getPropertyDraftSubmission` / `useGetPropertyDraftSubmission` (resume draft) |
| POST | `/property-submissions` | `savePropertyDraftSubmission` / `useSavePropertyDraftSubmission` (create draft) |
| PATCH | `/property-submissions/{submissionId}` | `updatePropertyDraftSubmission` / `useUpdatePropertyDraftSubmission` (`action: save_draft`) |
| POST | `/property-submissions/submit` | `submitPropertySubmission` / `useSubmitPropertySubmission` (`payload` + `confirm_submit: true`, no draft id) |
| POST | `/property-submissions/{submissionId}/submit` | `submitPropertyDraftSubmission` / `useSubmitPropertyDraftSubmission` (`confirm_submit: true`, existing draft) |
| POST | `/uploads/presigned-url` | `requestUploadPresignedUrl` / `uploadOwnerDocument` (owner documents) |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalogItems`, `activeStep`, `maxReachedStep`, `propertyDetails`, `submissionId`, `isCatalogLoading`, `isSubmitting`.
- Reads `submission_id` from `useSearchParams` on load; `router.replace` updates query after first successful draft save.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.
- Host owns `propertyDetails` and `maxReachedStep`; library returns merged values on `onNext` and forward `onStepClick` for persistence.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, `PropertyForm` props, `unsavedChangesModal`, `hasUnsavedChanges`, `dirtyStepIds`, `isCatalogLoading`, `reloadCreateCatalog`

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onNext(propertyDetails)` | Persist merged step values from library, advance `activeStep`, bump `maxReachedStep` |
| `onPrevious` | Decrement `activeStep` (min 0) |
| `onStepClick(index, step, propertyDetails)` | Persist values when moving forward; set `activeStep` and update `maxReachedStep` |
| `onSubmit` | No `submission_id`: direct `POST /property-submissions/submit`. With id: PATCH draft + POST submit; sets `isSubmitting` on `PropertyForm` |
| `onDraft(propertyDetails)` | POST or PATCH draft save; returns `true` when API succeeds |
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
