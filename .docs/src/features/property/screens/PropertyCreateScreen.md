# File Overview

Create-property screen at `/en/property-create`. Loads taxonomy/feature catalog on mount, then renders `@abdoun/abdoun-library` `PropertyForm`.

**Source:** `src/features/property/screens/PropertyCreateScreen.tsx`

# Responsibilities

- Render localized page title and subtitle.
- Show role-aware breadcrumb on `md+` (hidden on `sm`) in the header row right section.
- Show `PropertyCreateScreenSkeleton` while catalog APIs load.
- Render `PropertyForm` with mapped catalog data and step navigation from `usePropertyCreateScreen`.

# Imports

- `usePropertyCreateScreen`, `PropertyCreateScreenSkeleton`, `Breadcrumb`, `PropertyForm` from `@abdoun/abdoun-library`, typography helpers

# Navigation

- `app/[locale]/(main)/(listings)/property-create/page.tsx` — `useAuthorize("PROPERTY_CREATE")`
- Breadcrumb: `/dashboard` → `/my-listings` or `/manage-listings` → current (Create)

# API Usage

Catalog prefetch, draft save, and submit are owned by [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md). Draft: `POST` / `PATCH /property-submissions`. Submit: `POST /property-submissions/{id}/submit`.

# Props / Parameters

Screen receives all form props from `usePropertyCreateScreen()` — see hook doc for `activeStep`, catalog mappers, and callbacks.

# UI Details

- Header row matches `ListingPropertyScreen` / `ManageListingsScreen` layout.
- Loading skeleton mirrors header + multi-step form shell (vertical step list on `lg`, horizontal step pills on smaller viewports, field grid, footer actions).
- Breadcrumb: `hidden md:flex` on the right; Home icon, List icon + listings label, Create (current).
- `PropertyForm` owns step content and validation; host controls `activeStep`, `maxReachedStep`, persisted `propertyDetails`, and navigation callbacks.
- Light/dark semantic tokens; i18n in all four locales for page chrome (form labels live in the library).
- Requires `@abdoun/abdoun-library` v0.1.58+ for terms-gated submit, owner/media/document uploads (`PropertyForm` + presigned upload hooks).
- Passes `isDraftLoading={isDraftSaving}` and `isSubmitting` to disable the form while draft save or submit is in flight.

# Flow Description

1. Page guard passes user with `PROPERTY_CREATE`.
2. Hook fetches property taxonomy, location taxonomy, and active features in parallel.
3. Screen shows skeleton until catalog load completes.
4. Screen renders header + `PropertyForm` with mapped `categoryTaxonomy`, `locationTaxonomy`, and `featuresAndAmenities`.
5. User moves through steps via library validation + host `onNext` / `onPrevious` / `onStepClick`; `onDraft` saves, `onSubmit` saves then submits when terms are accepted.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [PropertyCreateScreenSkeleton.md](../components/PropertyCreateScreenSkeleton.md)
- [propertyForm.mapper.md](../mappers/propertyForm.mapper.md)
- [breadcrumb/index.md](../../../components/ui/breadcrumb/index.md)
