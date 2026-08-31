# File Overview

App-owned `Show Location` switch inserted into the library-owned Create Property Location form.

**Source:** `src/features/property/components/PropertyLocationVisibilityField.tsx`

# Responsibilities

- Render the localized location-visibility setting with the shared `SwitchField`.
- Mount the field at the end of the active `PropertyForm` Location form through a React portal because `@abdoun/abdoun-library` does not expose a Location-step slot.
- Remain presentational: checked state, disabled state, labels, and the change callback come from `usePropertyCreateScreen`.

# Imports

- `SwitchField` from `@/src/components/ui`
- `MapPin` from `lucide-react`
- `createPortal` from `react-dom`

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `checked` | Current `show_location` boolean |
| `disabled` | Locks the switch while the form is read-only, saving, or submitting |
| `title`, `description`, `ariaLabel` | Localized `propertyList.propertyCreate.locationVisibility` copy |
| `onChange` | Emits the next boolean to the screen hook |

# Actions / Inputs

- The user toggles whether every role may see the published property's Location tab.
- The control does not alter City, Area, or Address validation.

# UI Details

- Uses semantic colors and the shared responsive switch.
- The row spans both Location-form grid columns and has a token-based divider.
- The switch has an expanded pointer target for touch use.
- Supports light/dark themes and RTL through shared UI primitives.

# Flow Description

1. `PropertyCreateScreen` renders this component only on the Location step.
2. The component locates the active library form inside the screen-owned wrapper.
3. A portal appends the switch row after the existing location inputs.
4. Changes update host-owned property form state; create/update mappers send `payload.location.show_location`.

# Dependencies

- [../hooks/usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [../screens/PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [../../../components/ui/switch/index.md](../../../components/ui/switch/index.md)

# Notes

- The portal is a scoped app-boundary integration and does not modify or copy library source.
