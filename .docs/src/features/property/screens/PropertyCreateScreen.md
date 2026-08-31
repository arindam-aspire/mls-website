# File Overview

Create-property screen at `/en/property-create`. Loads taxonomy/feature catalog on mount, then renders `@abdoun/abdoun-library` `PropertyForm`.

**Source:** `src/features/property/screens/PropertyCreateScreen.tsx`

# Responsibilities

- Render localized page title and subtitle.
- Show role-aware breadcrumb on `md+` (hidden on `sm`) in the header row right section.
- Show `PropertyCreateScreenSkeleton` while catalog APIs load.
- Render `PropertyForm` with mapped catalog data, `ownerInfoConfig`, and step navigation from `usePropertyCreateScreen`.
- Mount `PropertyCreateAgencyField` only on Step 8 so it can portal the Agency Routing card immediately before Terms & Conditions.
- Attach `propertyFormContainerRef` around the library form so Reference Number remains visible and focusable but cannot be manually edited.
- Render `PropertyLocationVisibilityField` only on the Location step so the API-backed visibility setting appears after the existing City, Area, and Address controls.

# Imports

- `usePropertyCreateScreen`, `PropertyCreateAgencyField`, `PropertyLocationVisibilityField`, `PropertyCreateScreenSkeleton`, `Breadcrumb`, `PropertyForm` from `@abdoun/abdoun-library`, typography helpers

# Navigation

- `app/[locale]/(main)/(listings)/property-create/page.tsx` — `useAuthorize("PROPERTY_CREATE")`
- Breadcrumb: `/dashboard` → `/my-listings` or `/manage-listings` → current (Create)

# API Usage

Catalog prefetch, draft save, and submit are owned by [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md). Draft: `POST` / `PATCH /property-submissions`. Submit: `POST /property-submissions/{id}/submit`.

# Props / Parameters

Screen receives all form props from `usePropertyCreateScreen()` — see hook doc for `activeStep`, catalog mappers, and callbacks.

# UI Details

- Header row matches `ListingPropertyScreen` / `ManageListingsScreen` layout.
- Super Admin and Owner see [PropertyCreateAgencyField.md](../components/PropertyCreateAgencyField.md) inside Step 8 immediately before Terms & Conditions; Agent / Agency Admin do not.
- Loading skeleton mirrors header + multi-step form shell (vertical step list on `lg`, horizontal step pills on smaller viewports, field grid, footer actions).
- Breadcrumb: `hidden md:flex` on the right; Home icon, List icon + listings label, Create (current).
- `PropertyForm` owns step content and validation; host controls `activeStep`, `maxReachedStep`, persisted `propertyDetails`, and navigation callbacks.
- Reference Number is backend-owned. The host applies native read-only semantics to the library input, displays the value returned by draft hydration/save responses, and does not include it in outbound property payloads.
- On Location step 2, the host-owned Show Location switch is portaled into the library form and disabled with the rest of the form during read-only/save/submit states.
- On Review & Submit step 8, the host-owned Agency Routing card is portaled before Terms. Routing defaults off; checking it reveals the required agency dropdown.
- Light/dark semantic tokens; i18n in all four locales for page chrome (form labels live in the library).
- Requires `@abdoun/abdoun-library` v0.1.61+ for `PropertyForm` `canEdit` / `rejectionReason` (read-only submitted, resubmit alert when rejected).
- Passes `canEdit` and `rejectionReason` from draft submission `status` / `review_reason`.
- Passes `isDraftLoading={isDraftSaving}` and `isSubmitting` to disable the form while draft save or submit is in flight.
- Unsaved-change detection uses `propertyDetails` from `usePropertyCreateScreen` (not library live-payload props on `PropertyForm` in `@abdoun/abdoun-library` v0.1.79).
- Renders [PropertyCreateUnsavedChangesModal.md](../components/PropertyCreateUnsavedChangesModal.md) when leaving the page with unsaved step edits.

# Flow Description

1. Page guard passes user with `PROPERTY_CREATE`.
2. Hook fetches property taxonomy, location taxonomy, and active features in parallel.
3. Screen shows skeleton until catalog load completes.
4. Screen renders the header and `PropertyForm` with mapped `categoryTaxonomy`, `locationTaxonomy`, and `featuresAndAmenities`.
5. On Location, the Show Location switch defaults to off and emits changes to the host hook without changing existing location validation.
6. On Property Details, Reference Number cannot be manually changed; an existing or newly generated backend value is displayed without frontend generation.
7. On Step 8, eligible users can opt into Agency Routing and must select an agency only when checked.
8. `onDraft` saves `route_through_agency`, conditional `agency_id`, and the normal form payload; `onSubmit` preserves the same routing state without changing Terms behavior.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [PropertyCreateAgencyField.md](../components/PropertyCreateAgencyField.md)
- [PropertyLocationVisibilityField.md](../components/PropertyLocationVisibilityField.md)
- [PropertyCreateScreenSkeleton.md](../components/PropertyCreateScreenSkeleton.md)
- [propertyForm.mapper.md](../mappers/propertyForm.mapper.md)
- [breadcrumb/index.md](../../../components/ui/breadcrumb/index.md)
