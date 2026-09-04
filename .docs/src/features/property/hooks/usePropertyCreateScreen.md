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
- Expose `propertyFormContainerRef` and mark the library-owned `reference_number` input as native read-only whenever the Property Details step mounts. This prevents typing, pasting, or modifying the displayed backend value while preserving the library's existing required validation and form flow.
- Own the Location-step `show_location` value. It defaults to `false`, survives library step payload emissions, participates in Location dirty-state tracking, and hydrates from saved drafts.
- `onDraft` → `POST /property-submissions` when no `submission_id` query; `PATCH /property-submissions/{submissionId}` when resuming. A successful response merges its server-generated `payload.property_details.reference_number` into the displayed form state. Returns `boolean` success for unsaved-changes modal and clears the dirty baseline on success.
- Reference-number merging initializes the complete v0.1.89 `PropertyDetailsFormValues` contract, including the default `SQM` Built-up Area unit and empty guard contact fields, before restoring saved values.
- **Unsaved-changes baseline:** After catalog load (and draft hydration when `submission_id` is present), the dirty baseline is taken from the library `PropertyForm` **live payload** (deferred one tick), not from the API mapper output — avoids false “unsaved changes” when resuming a draft without edits.
- **Unsaved changes:** delegates to [usePropertyCreateUnsavedChanges.md](./usePropertyCreateUnsavedChanges.md) — per-step dirty tracking, navigation guard + link/back/keyboard refresh interception, custom modal (**Save as Draft** / **Discard** / **Cancel**). Tracks `propertyDetails` from the screen hook until `@abdoun/abdoun-library` ships live payload callbacks.
- Owner document upload via `useOwnerDocumentUpload` (`context: owner_document`).
- **Owner step (`ownerInfoConfig`):** requires at least one uploaded document per owner (Next disabled until valid); localized validation via `propertyList.propertyCreate.ownerInfo`; owner-role users get auto-filled first owner on new create and read-only name/phone/email on rows matching their account email (draft resume included). See [propertyCreateOwnerInfo.utils.md](../utils/propertyCreateOwnerInfo.utils.md).
- Media step uploads via `usePropertyMediaUpload(submissionId)` — `property_media_image` → `media_files`, `property_document` → `documents`; presign uses `submission_id` (save draft first if missing).
- `onSubmit` → when **no** `submission_id`: `POST /property-submissions/submit` with `{ route_through_agency, agency_id, payload, confirm_submit: true }`. When `submission_id` exists: `PATCH` the routing state and full payload, then `POST /property-submissions/{id}/submit` with `{ confirm_submit: true }`. Library still gates Submit on the unchanged Terms acceptance state.
- After either submit path succeeds, preserve the existing success toast, commit the saved snapshot to bypass the Draft/unsaved-changes prompt, and redirect immediately by role: Owner/registered user → `/my-listings`; Agent/Agency Admin/Super Admin → `/manage-listings`. Failed submissions remain on the form and retain existing error handling.
- **Agency Routing:** Step 8-only for Super Admin (`super_admin`) and Property Owner (`owner`). The checkbox defaults to `false`; the agency API query and required dropdown activate only when checked. Submit is blocked when routing is checked without an agency. Draft resume hydrates both top-level `route_through_agency` and `agency_id`. Unchecked saves/submits send `false` and `agency_id: null`, clearing a previous draft selection.

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
| GET | `/agency/list?skip=0&limit=100` | `getAgencyList` (enabled when Super Admin / Owner checks Agency Routing) |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalogItems`, `activeStep`, `maxReachedStep`, `propertyDetails` (including `location_insert.show_location`), `submissionId`, `routeThroughAgency` (default `false`), `selectedAgencyId`, `agencyFieldError`, `isCatalogLoading`, `isSubmitting`.
- Reads `submission_id` from `useSearchParams` on load; `router.replace` updates query after first successful draft save.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.
- Host owns `propertyDetails` and `maxReachedStep`; library returns merged values on `onNext` and forward `onStepClick` for persistence. The library-owned split Built-up Area control stores its decimal string and `"SQM"`/`"SQFT"` unit in this state.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, `PropertyForm` props, `propertyFormContainerRef`, Step 8 `agencyField` routing model (or `null`), localized `locationVisibilityField`, `unsavedChangesModal`, `hasUnsavedChanges`, `dirtyStepIds`, `isCatalogLoading`, `reloadCreateCatalog`

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onNext(propertyDetails)` | Persist merged step values from library, advance `activeStep`, bump `maxReachedStep` |
| `onPrevious` | Decrement `activeStep` (min 0) |
| `onStepClick(index, step, propertyDetails)` | Persist values when moving forward; set `activeStep` and update `maxReachedStep` |
| `onSubmit` | Direct-submit or PATCH-then-submit; sends `route_through_agency`, then redirects to the role-specific listing page on success without opening the Draft modal. Requires `agency_id` only when routing is checked |
| `onRouteThroughAgencyChange` | Toggles routing, clears stale field errors, and controls agency query/dropdown visibility |
| `onAgencyChange` | Sets `selectedAgencyId` for the conditional Super Admin / Owner dropdown |
| `onShowLocationChange` | Updates `location_insert.show_location`; defaults to `false` and is retained across library callbacks |
| `onDraft(propertyDetails)` | POST or PATCH draft save; merges a returned server-generated Reference Number into form state and returns `true` when API succeeds |
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
