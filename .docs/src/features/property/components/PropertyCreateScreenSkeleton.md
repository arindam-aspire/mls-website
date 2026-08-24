# File Overview

Loading skeleton for `PropertyCreateScreen` while create-form catalog APIs load.

**Source:** `src/features/property/components/PropertyCreateScreenSkeleton.tsx`

# Responsibilities

- Mirror page header row (title, subtitle, breadcrumb placeholders).
- When `showAgencyField` is true, mirror the Agency dropdown card (`rounded-xl`, label + control, `md:max-w-md`).
- Mirror `PropertyForm` shell: `rounded-xl` card, vertical step list on `lg`, horizontal step pills on smaller viewports, two-column field grid, footer action buttons.

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `showAgencyField` | When true, include the Agency field skeleton (Super Admin / Owner). Default `false`. |

# UI Details

- `aria-busy` + `aria-hidden` on root.
- Semantic `bg-surface`, `border-secondary/15`; controls use `rounded-lg`, card uses `rounded-xl`.
- Mobile-first: stacked footer actions, hidden sidebar below `lg`.

# Dependencies

- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [Skeleton](../../../components/ui/skeleton/index.md)
