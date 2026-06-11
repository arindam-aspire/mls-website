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
- Map catalog payloads to `@abdoun/abdoun-library` `PropertyForm` prop shapes via `propertyForm.mapper`.
- Own `activeStep` and wire `onNext`, `onPrevious`, `onStepClick` against `propertyFormSteps`.
- `onDraft` → `POST /property-submissions` when no `submission_id` query; `PATCH /property-submissions/{submissionId}` with `{ action: "save_draft", current_step, payload }` when resuming a draft. On first save, persist `data.submission_id` in the URL query.
- Stub `onSubmit` and upload callbacks until submit/upload APIs exist.

# API Usage

| Method | Endpoint | Service / mutation |
| --- | --- | --- |
| GET | `/property-taxonomy` | `getPropertyTaxonomy` / `useGetPropertyTaxonomy` |
| GET | `/location-taxonomy` | `getLocationTaxonomy` / `useGetLocationTaxonomy` |
| GET | `/features?is_active=true` | `getPropertyFeatureCatalog` / `useGetPropertyFeatureCatalog` |
| POST | `/property-submissions` | `savePropertyDraftSubmission` / `useSavePropertyDraftSubmission` (create draft) |
| PATCH | `/property-submissions/{submissionId}` | `updatePropertyDraftSubmission` / `useUpdatePropertyDraftSubmission` (`action: save_draft`) |

# State Management

- Reads `user` from `useAuthStore` for breadcrumb path.
- Local state: `propertyTaxonomy`, `locationTaxonomy`, `featureCatalogItems`, `activeStep`, `maxReachedStep`, `propertyDetails`, `submissionId`, `isCatalogLoading`.
- Reads `submission_id` from `useSearchParams` on load; `router.replace` updates query after first successful draft save.
- `useGetPropertyTaxonomy` / `useGetLocationTaxonomy` also update `property.store` on success.
- Host owns `propertyDetails` and `maxReachedStep`; library returns merged values on `onNext` and forward `onStepClick` for persistence.

# Exports

- `usePropertyCreateScreen()` — page copy, breadcrumb, `PropertyForm` props (`activeStep`, `maxReachedStep`, `categoryTaxonomy`, `locationTaxonomyForForm`, `featuresAndAmenities`, `propertyDetails`, navigation/upload/submit callbacks), `isCatalogLoading`, `reloadCreateCatalog`

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onNext(propertyDetails)` | Persist merged step values from library, advance `activeStep`, bump `maxReachedStep` |
| `onPrevious` | Decrement `activeStep` (min 0) |
| `onStepClick(index, step, propertyDetails)` | Persist values when moving forward; set `activeStep` and update `maxReachedStep` |
| `onSubmit` | Stub — TODO create-property submit |
| `onDraft(propertyDetails)` | Persist library payload (incl. `active_step`), POST or PATCH draft save |
| `onUploadOwnerDocument` | Stub — returns `null` |
| `onUploadPropertyMedia` | Stub — returns `null` |
| `onUploadPropertyDocument` | Stub — returns `null` |

# Dependencies

- `resolveListingsMenuPath` from `profileMenuRoleAccess.ts`
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [propertyForm.mapper.md](../mappers/propertyForm.mapper.md)
- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)
- [propertyForm.constants.md](../constants/propertyForm.constants.md)
