# File Overview

Localized labels for Add Property DLS cascading selects.

**Source:** `src/features/property/i18n/propertyLocationDls.i18n.ts`

# Responsibilities

- Map `propertyList.propertyCreate.dls.*` keys into a labels object for `usePropertyLocationDls`.
- Keys: section title, Governate / Directorate / Village / Parcel Name / Section / Land Type labels and placeholders, parent-first hints, loading, empty, load error, retry.
- Form-state label keys use `governent` / `governentPlaceholder` / `selectGovernentFirst` (legacy key spelling; English UI label is **Governate**), `directorate*`, and `parcel*` (English UI label **Parcel Name**; Arabic **الحوض**). Section English is **Section**; Arabic **الحي**. API levels and payload keys remain `dept` / `dept_*` and `hod` / `hod_*`.
- `landType` / `landTypePlaceholder` label the host-owned Land Type select (Residential/Commercial only). Option labels come from the API Arabic `name` values, not these keys.
- Free-text DLS labels (Parcel Number, Plot Number, Building, Floor, Apartment) come from `propertyList.propertyCreate.form.identification.*` via `usePropertyCreateScreen` / `buildPropertyFormConfig`. Land Plot Number uses the same `identification.plotNumber` label as Residential/Commercial.

# Exports

- `buildPropertyLocationDlsLabels(t)`
- `PropertyLocationDlsLabels`

# Dependencies

- [usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
- Locale files: `src/messages/{en,ar,es,fr}/propertyList.json`
