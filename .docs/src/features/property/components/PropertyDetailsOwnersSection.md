# File Overview

Renders **Owner details** for properties with **multiple owners** on the property details screen. Used when `propertyViewOwners.length > 1`; a single owner stays in library `PropertyView`.

**Source:** `src/features/property/components/PropertyDetailsOwnersSection.tsx`

# Responsibilities

- Display localized **Owner details** heading.
- Render one row per owner (name + phone/email), matching library owner chip styling (`bg-page`, `rounded-lg`).
- Hide when `owners` is empty.

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `owners` | library owner shape[] | From `resolvePropertyViewOwners` |
| `title` | `string` | Section heading (`propertyList.details.owners.title`) |
| `noContactLabel` | `string` | Fallback when owner has no phone/email |
| `className` | `string` | Optional layout classes (sticky right column on `lg`) |

# UI Details

- **Card:** `rounded-xl`, `bg-surface`, semantic borders
- **Responsive:** full width on mobile; parent grid places card in `lg:col-span-1`
- **Light/dark:** semantic tokens only

# Dependencies

- [../mappers/mapPropertyDetailsForPropertyView.md](../mappers/mapPropertyDetailsForPropertyView.md)
- [../screens/PropertyDetailsScreen.md](../screens/PropertyDetailsScreen.md)
