# File Overview

Modal for owners without a linked agency to pick one from `GET /agency/list` before creating a property.

**Source:** `src/features/profile/modals/SelectAgencyModal.tsx`

# Responsibilities

- Render modal shell (title, description, close).
- **Search** agencies client-side (`SearchInput`) by name, email, or location.
- Show agency count, scrollable list, empty/search-empty states, or error toast (via hook).
- Footer: selected agency preview (avatar + name/contact) or hint; **Continue** → `PATCH /users/agency` `{ agencyId }`, then `/property-create?agency_id={id}` on success.

# Imports

- Modal primitives from `@/src/components/ui/modal`
- `SelectAgencyListItem`, `SelectAgencyModalSkeleton`
- `useSelectAgencyModal`

# API Usage

| Method | Path | When |
| --- | --- | --- |
| GET | `/agency/list?skip=0&limit=50` | `enabled` when modal `isOpen` |

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Search | Filters list client-side; clear resets query |
| Select agency row | Radio-style selection with trailing indicator |
| Continue | Requires selection → `assignUserAgencyAndRefreshUser` → `router.push` property create with `agency_id` |
| Close | Dismiss modal; clears selection and search |

# UI Details

- Modal `size="lg"`; list `max-h-[min(26rem,52vh)]` scroll.
- `rounded-xl` list items; `rounded-lg` search and Continue button.
- Semantic tokens; light/dark via theme.

# Dependencies

- [useSelectAgencyModal.md](../hooks/useSelectAgencyModal.md)
- [SelectAgencyListItem.md](../components/SelectAgencyListItem.md)
- [useAddPropertyEntry.md](../../property/hooks/useAddPropertyEntry.md)
