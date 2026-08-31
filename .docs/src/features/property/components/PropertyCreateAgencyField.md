# File Overview

Presentational **Agency Routing** section for Create Property Step 8 (Review & Submit). Shown only for Super Admin and Property Owner and portaled immediately before the library-owned Terms & Conditions card.

**Source:** `src/features/property/components/PropertyCreateAgencyField.tsx`

**Where used:** [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)

# Responsibilities

- Locate the library Terms card through `input[name="terms_accept_all"]` and insert a portal target immediately before it.
- Render an unchecked-by-default routing `CheckboxField` in a review card that reuses the Terms & Conditions card classes.
- Hide the Agency `Select` while routing is unchecked.
- Render the Agency `Select` as required when routing is checked.
- Display loading, empty, validation, and API-error copy via `hint` / `error`.
- Optionally render a Retry control when the agency list request failed.

# Imports

- `Button`, `Card`, `CheckboxField`, `Select` from `@/src/components/ui`
- `SelectOption` from `@/src/components/ui/select/types`
- React DOM `createPortal`

# Exports

- `PropertyCreateAgencyField`
- `PropertyCreateAgencyFieldProps`

# State Management

Local state stores only the dynamically inserted portal target. Routing state, agency selection, and callbacks come from [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md).

# API Usage

None. The parent hook calls `GET` agency list via `getAgencyList`.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `sectionTitle` / `routingQuestion` | Localized Agency Routing heading and checkbox copy |
| `routeThroughAgency` | Controlled `route_through_agency` checkbox value |
| `onRouteThroughAgencyChange` | Updates routing state in the screen hook |
| `label` / `placeholder` | Localized field chrome |
| `options` | Agency `value` / `label` pairs |
| `value` | Selected `agency_id` (empty string when unset) |
| `onChange` | Updates selected agency in the screen hook |
| `error` | Validation or list-load error |
| `hint` | Loading or empty-state helper text |
| `routingDisabled` | Disables only the routing checkbox during read-only/save/submit states |
| `disabled` | Disables the Agency select during read-only/save/submit/loading/empty states |
| `isRequired` | `true` while routing is checked |
| `retryLabel` / `onRetry` | Shown only when the list request failed |

# Actions / Inputs

- User checks or unchecks agency routing.
- When checked, the user selects an agency from the required dropdown.
- User can retry the agency list when load failed.

# UI Details

- Card uses the exact Terms & Conditions review-card classes: `border border-secondary/10 bg-page p-4 sm:p-5`; the shared card supplies the same radius and shadow.
- Heading uses the same responsive uppercase section-title typography and spacing as Terms & Conditions.
- Select trigger uses shared `Select` (`rounded-lg`).
- Dropdown width `md:max-w-md`; stacks full-width on small screens.
- Retry is `outline` `sm` button (`rounded-lg`).
- Light/dark via semantic tokens.

# Flow Description

1. Screen mounts the component only on Step 8 for `super_admin` or `owner`.
2. The component observes the form container until the Terms checkbox exists, inserts a target before its card, and portals Agency Routing there.
3. Routing defaults to `false`; the Agency select is absent.
4. Checking routing shows the required Agency select and enables the existing agency query/options flow.
5. Changes update host-owned `routeThroughAgency` / `selectedAgencyId`, which are saved in drafts and submitted as top-level request fields.

# Notes

- The portal is an app-side compatibility bridge because `@abdoun/abdoun-library` does not expose a slot before Terms & Conditions. It relies on the stable `terms_accept_all` input name and review-card `data-slot`.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [select/index.md](../../../components/ui/select/index.md)
