# File Overview

Presentational Agency dropdown for the property create / draft-resume form. Shown only for Super Admin and Property Owner.

**Source:** `src/features/property/components/PropertyCreateAgencyField.tsx`

**Where used:** [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)

# Responsibilities

- Render a required Agency `Select` in a `rounded-xl` card above `PropertyForm`.
- Display loading, empty, validation, and API-error copy via `hint` / `error`.
- Optionally render a Retry control when the agency list request failed.

# Imports

- `Button`, `Select` from `@/src/components/ui`
- `SelectOption` from `@/src/components/ui/select/types`

# Exports

- `PropertyCreateAgencyField`
- `PropertyCreateAgencyFieldProps`

# State Management

None. All values and callbacks come from [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md).

# API Usage

None. The parent hook calls `GET` agency list via `getAgencyList`.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `label` / `placeholder` | Localized field chrome |
| `options` | Agency `value` / `label` pairs |
| `value` | Selected `agency_id` (empty string when unset) |
| `onChange` | Updates selected agency in the screen hook |
| `error` | Validation or list-load error |
| `hint` | Loading or empty-state helper text |
| `disabled` | Read-only form, in-flight submit, loading, or empty list |
| `isRequired` | Always `true` for this field |
| `retryLabel` / `onRetry` | Shown only when the list request failed |

# Actions / Inputs

- User selects an agency from the dropdown.
- User can retry the agency list when load failed.

# UI Details

- Outer card: `rounded-xl border border-secondary/15 bg-surface`, padding `p-4 sm:p-6`.
- Select trigger uses shared `Select` (`rounded-lg`).
- Dropdown width `md:max-w-md`; stacks full-width on small screens.
- Retry is `outline` `sm` button (`rounded-lg`).
- Light/dark via semantic tokens.

# Flow Description

1. Hook decides the field is visible (`super_admin` or `owner`).
2. Screen passes resolved options, selection, and status strings.
3. Change events update `selectedAgencyId` used on draft save and submit payloads.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [select/index.md](../../../components/ui/select/index.md)
