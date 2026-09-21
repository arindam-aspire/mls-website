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
  - then `GET /property-form-options` (404 → empty catalog; listing purposes fall back to `sale` / `rent`)
- Build `PropertyForm` `config` via `buildPropertyFormConfig` (`propertyList.propertyCreate.form`).
- Wire owner search (`usePropertyOwnerSearch`), location map slot, `fieldErrors` / `stepErrors` / `submitError` / `ownerDuplicateError`, and `PropertyFormHandle` (`goToField` on BE field errors).
- When `GET /property-form-options` omits furnishing/floor lists (or 404s), fill those dropdowns from the existing search-filter master values so Floor and Furnishing Status still render.
- Owner nationality options come from `data.nationalities` (or `data.nationality`) on that same endpoint. If the array is missing or empty, the host does not pass `nationalityOptions`, so the library compatibility list can still render until the master API includes nationalities.
- When `submission_id` is in the query on **initial mount** (e.g. resume from draft listings), after catalogs load, `GET /property-submissions/{id}` hydrates the form. Floor is taken from GET `floor` (also `floor_id` / `floor_level`) and injected into the Floor dropdown if that option is missing. `draftHydratedForRef` is set only after a successful fetch (not from the URL on mount), so resume still loads data while first draft save + URL sync does not re-fetch.
- From draft `status` / `workflow_stage` (and optional GET `can_edit` / `can_edit_submission`): editable for `draft` / `in_progress`, rejected resubmit (submitter or assigned agent), and agent-assigned stages; `submitted` and other non-editable statuses → `canEditSubmission: false`. Rejected → `rejectionReason` from `review_reason` (library resubmit alert + Resubmit label).
- Owner pre-selected `?agency_id=` (legacy Select Agency continue URL) hydrates `selectedAgencyId` and sets `routeThroughAgency` to `true` so draft/submit keep `agency_id` (not cleared as unchecked routing). Owner Add Property itself no longer opens that modal; routing defaults off.
- Map catalog payloads to `@abdoun/abdoun-library` `PropertyForm` prop shapes via `propertyForm.mapper`.
- Own `activeStep` and wire `onNext`, `onPrevious`, `onStepClick` against `propertyFormSteps`. Clear stale draft/submit `fieldErrors` / `stepErrors` / `submitError` on those navigations so leftover API errors (for example **Unknown DLS hod code**) cannot snap the library back to the error step and make **Next** look broken.
- Expose `propertyFormContainerRef` and apply host DOM patches via [propertyCreateFormDom.utils.md](../utils/propertyCreateFormDom.utils.md): hide empty backend Reference Number and show it read-only once valued, hide Built-up Area unit (sqm only), rewrite owner document labels to **Owner ID or Passport**.
- Pass `measurementUnit="SQM"` into `PropertyForm` (agency measurement preference is not used on Add Property).
- Show the exact backend `message` on draft/submit failure (toast + form `submitError`). Generic Axios **Network Error** is replaced with localized unreachable/timeout/server copy; useful BE messages are kept.
- Own the Location-step `show_location` value. It defaults to `false`, survives library step payload emissions, participates in Location dirty-state tracking, and hydrates from saved drafts.
- Own Location-step DLS selection (`gov_code` … `sect_name`) via `usePropertyLocationDls`. Library step emissions are merged with the latest DLS selection the same way as `show_location`. Options load from `GET /dls-locations`; child levels stay disabled until the parent code is set. DLS-only API field errors are kept off `PropertyForm` `fieldErrors` (shown on the host DLS selects instead) so the library does not treat `hod_code` as step 1 and trap Next.
- `onDraft` → `POST /property-submissions` when no `submission_id` query; `PATCH /property-submissions/{submissionId}` when resuming. A successful response merges its server-generated `payload.property_details.reference_number` into the displayed form state. Returns `boolean` success for unsaved-changes modal and clears the dirty baseline on success.
- Reference-number merging initializes the complete v0.1.89 `PropertyDetailsFormValues` contract, including the default `SQM` Built-up Area unit and empty guard contact fields, before restoring saved values.
- **Unsaved-changes baseline:** After catalog load (and draft hydration when `submission_id` is present), the dirty baseline is taken from the library `PropertyForm` **live payload**, deferred one tick (`queueMicrotask`) — not from the API mapper output alone — avoids false “unsaved changes” when resuming a draft without edits.
- **Unsaved changes:** delegates to [usePropertyCreateUnsavedChanges.md](./usePropertyCreateUnsavedChanges.md) — per-step dirty tracking, navigation guard + link/back/keyboard refresh interception, custom modal (**Save as Draft** / **Discard** / **Cancel**). Tracks `propertyDetails` from the screen hook until `@abdoun/abdoun-library` ships live payload callbacks.
- Owner document upload via `useOwnerDocumentUpload` (`context: owner_document`).
- **Owner step (`ownerInfoConfig`):** requires at least one uploaded document per owner (Next disabled until valid); localized validation via `propertyList.propertyCreate.ownerInfo`; owner-role users get auto-filled first owner on new create and read-only name/phone/email on rows matching their account email (draft resume included). See [propertyCreateOwnerInfo.utils.md](../utils/propertyCreateOwnerInfo.utils.md).
- Media step uploads via `usePropertyMediaUpload(submissionId, { ensureSubmissionIdRef })` — prefer `submission_id`; when missing, auto-save draft via `onDraft` then upload; fall back to `draft_client_id` if ensure fails (`property_media_image` → `media_files`, `property_document` → `documents`).
- `onSubmit` → when **no** `submission_id`: `POST /property-submissions/submit` with `{ route_through_agency, agency_id, payload, confirm_submit: true }`. When `submission_id` exists: `PATCH` the routing state and full payload, then `POST /property-submissions/{id}/submit` with `{ confirm_submit: true }`. Library still gates Submit on the unchanged Terms acceptance state.
- After either submit path succeeds, preserve the existing success toast, commit the saved snapshot to bypass the Draft/unsaved-changes prompt, and redirect immediately by role: Owner/registered user → `/my-listings`; Agent/Agency Admin/Super Admin → `/manage-listings`. Failed submissions remain on the form and retain existing error handling. For Owner, when the API omits `message`, the toast description uses returned `status` / `workflow_stage` (`pending-admin-approval` vs `pending-approval` / `submitted`) without adding a new approval UI.
- **Agency Routing:** Step 8-only for Super Admin (`super_admin`) and Property Owner (`owner`). Super Admin keeps the existing checkbox. Owner sees a **Verify through Agency** switch (default `false`). The agency API query and required dropdown activate only when routing is on. Submit is blocked when routing is on without an agency. Draft resume hydrates both top-level `route_through_agency` and `agency_id`. Routing-off saves/submits send `false` and `agency_id: null`, clearing a previous draft selection.

# API Usage

| Method | Endpoint | Service / mutation |
| --- | --- | --- |
| GET | `/property-taxonomy` | `getPropertyTaxonomy` / `useGetPropertyTaxonomy` |
| GET | `/location-taxonomy` | `getLocationTaxonomy` / `useGetLocationTaxonomy` |
| GET | `/features?is_active=true` | `getPropertyFeatureCatalog` / `useGetPropertyFeatureCatalog` |
| GET | `/property-form-options` | `getPropertyFormOptions` / `useGetPropertyFormOptions` (no error toast; 404 allowed) |
| GET | `/property-submissions/{submissionId}` | `getPropertyDraftSubmission` / `useGetPropertyDraftSubmission` (resume draft) |
| POST | `/property-submissions` | `savePropertyDraftSubmission` / `useSavePropertyDraftSubmission` (create draft) |
| PATCH | `/property-submissions/{submissionId}` | `updatePropertyDraftSubmission` / `useUpdatePropertyDraftSubmission` (`action: save_draft`) |
| POST | `/property-submissions/submit` | `submitPropertySubmission` / `useSubmitPropertySubmission` (`payload` + `confirm_submit: true`, no draft id) |
| POST | `/property-submissions/{submissionId}/submit` | `submitPropertyDraftSubmission` / `useSubmitPropertyDraftSubmission` (`confirm_submit: true`, existing draft) |
| GET | `/dls-locations` | `getDlsLocations` / `usePropertyLocationDls` (level + parent codes) |
| GET | `/agency/list?skip=0&limit=100` | `getAgencyList` (enabled when Super Admin / Owner turns Agency Routing on) |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalogItems`, `formOptionsCatalog`, `fieldErrors`, `stepErrors`, `submitError`, `ownerDuplicateError`, `activeStep`, `maxReachedStep`, `propertyDetails` (including `location_insert.show_location` and DLS codes/names), `submissionId`, `routeThroughAgency` (default `false`; `true` when Owner/Super Admin lands with `?agency_id=`), `selectedAgencyId`, `agencyFieldError`, `isCatalogLoading`, `isSubmitting`.
- Draft resume editability: client rules for `draft` / `in_progress` / rejected (submitter or assigned agent) / agent stages; explicit GET `can_edit` / `can_edit_submission` overrides those rules when present.
- `propertyFormRef` (`PropertyFormHandle`) for jumping to the first BE field error.
- Reads `submission_id` from `useSearchParams` on load; `router.replace` updates query after first successful draft save.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.
- Host owns `propertyDetails` and `maxReachedStep`; library returns merged values on `onNext` and forward `onStepClick` for persistence. Built-up Area is always stored and submitted as `"SQM"`. Legacy `"SQFT"` draft values are converted on hydrate.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, `PropertyForm` props, `propertyFormContainerRef`, Step 8 `agencyField` routing model (or `null`), localized `locationVisibilityField`, `locationDlsField`, `unsavedChangesModal`, `hasUnsavedChanges`, `dirtyStepIds`, `isCatalogLoading`, `reloadCreateCatalog`

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onNext(propertyDetails)` | Persist merged step values from library, clear stale submission errors, advance `activeStep`, bump `maxReachedStep` |
| `onPrevious` | Clear stale submission errors and decrement `activeStep` (min 0) |
| `onStepClick(index, step, propertyDetails)` | Clear stale submission errors; persist values when moving forward; set `activeStep` and update `maxReachedStep` |
| `onSubmit` | Direct-submit or PATCH-then-submit; sends `route_through_agency`, then redirects to the role-specific listing page on success without opening the Draft modal. Requires `agency_id` only when routing is on. Owner success toast description prefers the API `message`, else maps approval/status tokens without changing the form UI |
| `onRouteThroughAgencyChange` | Toggles routing, clears stale field errors, and controls agency query/dropdown visibility |
| `onAgencyChange` | Sets `selectedAgencyId` for the conditional Super Admin / Owner dropdown |
| `onShowLocationChange` | Updates `location_insert.show_location`; defaults to `false` and is retained across library callbacks |
| DLS field `onChange` | Updates `gov_code` / `gov_name` through `sect_code` / `sect_name`; clears descendant levels |
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
- [buildPropertyFormConfig.md](../i18n/buildPropertyFormConfig.md)
- [usePropertyOwnerSearch.md](./usePropertyOwnerSearch.md)
- [propertySubmissionError.utils.md](../utils/propertySubmissionError.utils.md)
- [propertyForm.constants.md](../constants/propertyForm.constants.md)
