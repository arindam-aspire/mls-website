# File Overview

Host DOM patches for `@abdoun/abdoun-library` `PropertyForm` on Add Property. The library does not expose props for these UAT-required host behaviors.

**Source:** `src/features/property/utils/propertyCreateFormDom.utils.ts`

# Responsibilities

- Keep the library-owned `reference_number` input native `readOnly` so a backend value cannot be typed or pasted.
- Hide the Reference Number field (label + input wrapper) while it is empty on new create. Show the same read-only field once draft save or hydration returns a non-empty backend value.
- Hide the Built-up Area **Unit** select (`name="built_up_area_unit"`) so the form accepts square metres only, without hiding the area value field.
- Replace hardcoded library copy `Owner Document` / `Owner Documents` with the host i18n label **Owner ID or Passport**.

# Imports

- None (DOM APIs only)

# Exports

- `applyPropertyCreateFormDomPatches(container, { ownerDocumentsLabel, hasReferenceNumber })`

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `container` | `PropertyForm` host wrapper element |
| `ownerDocumentsLabel` | Localized `propertyList.propertyCreate.form.ownerDocumentsLabel` |
| `hasReferenceNumber` | `true` when host form state already has a trimmed `property_details.reference_number` |

# Actions / Inputs

- No user input. The Reference Number field stays read-only; visibility follows whether a backend value exists.

# UI Details

- Empty Reference Number: the field wrapper is `hidden` + `aria-hidden` so the Property Details grid does not show a blank control.
- Non-empty Reference Number: wrapper is shown, input remains `readOnly` / `aria-readonly`.
- If a `label[for]` sits outside the wrapper, it is hidden or shown with the same rule.
- Built-up Area unit stays hidden; owner document labels are rewritten in place.

# Flow Description

1. `usePropertyCreateScreen` attaches a `MutationObserver` to the form container and re-applies patches after library re-renders (step changes).
2. On new create, `reference_number` is `""` so the field is hidden.
3. After draft save or draft hydration, the host merges the server `reference_number` and re-applies patches so the field appears read-only.
4. Built-up Area unit stays hidden; owner document labels are rewritten.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)

# Notes

- Preferred long-term fix is library props (`documentsLabel`, sqm-only unit, hide-until-valued reference). Until then, these patches are host-only and do not change storage or API contracts.
- Uniqueness is still backend-owned; this helper only controls visibility and read-only display.
