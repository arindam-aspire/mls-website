# File Overview

Presentational cascading DLS selects inserted into the library-owned Create Property Location form.

**Source:** `src/features/property/components/PropertyLocationDlsFields.tsx`

# Responsibilities

- Render Government → Department → Village → HOD → Section using the shared `Select`.
- Mount the fields into the active `PropertyForm` Location form through a React portal because `@abdoun/abdoun-library` does not expose a DLS slot.
- Remain presentational: options, values, loading/empty/error copy, retry, and change callbacks come from `usePropertyLocationDls` via `usePropertyCreateScreen`.

# Imports

- `Button`, `Select` from `@/src/components/ui`
- `PropertyLocationDlsFieldModel` from `usePropertyLocationDls`
- `Landmark` from `lucide-react`
- `createPortal` from `react-dom`

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `sectionTitle` | Localized DLS heading |
| `fields` | Five dependent select models (label, options, value, hint/error, retry, onChange) |

# Actions / Inputs

- The user picks a DLS code at each level. Child fields stay disabled until the parent code is set.
- Retry re-fetches the failing level without changing unrelated location fields.

# UI Details

- Uses semantic colors, `rounded-lg` selects, and the Location form’s 2-column grid (`contents` so each select is a grid cell).
- Heading spans both columns with a token-based divider, matching the Show Location row.
- Loading, empty, and API-error copy use the Agency-field hint/error/retry pattern.
- Supports light/dark themes and RTL through shared UI primitives.

# Flow Description

1. `PropertyCreateScreen` renders this component only on the Location step, before the Show Location switch.
2. The component locates the active library form inside the screen-owned wrapper.
3. A portal appends the DLS heading and five selects after the existing location inputs.
4. Changes update host-owned property form state; create/update mappers send DLS codes and names on `payload.location` and `payload.property_details`.

# Dependencies

- [../hooks/usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
- [../hooks/usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [../screens/PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)

# Notes

- The portal is a scoped app-boundary integration and does not modify or copy library source.
- Options come from `GET /dls-locations`; the Excel master file is never loaded in the browser.
