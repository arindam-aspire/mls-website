# File Overview

Selectable agency row for `SelectAgencyModal` (radio pattern).

**Source:** `src/features/profile/components/SelectAgencyListItem.tsx`

# Responsibilities

- Selectable row: circular agency logo (`Avatar` lg / 56px); secondary fallback when unselected (`selectAgencyAvatarClassName`), primary when selected (`selectAgencyAvatarSelectedClassName`); compact padding (`p-2`); agency name, email (`Mail` icon) and phone (`Phone` icon) when available.
- `role="radio"` with trailing circular indicator (`rounded-xl` card shell).

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `agency` | `AgencyListItem` | Normalized list row (`agency_name`, `email`, `phone`) |
| `selected` | `boolean` | Active selection |
| `onSelect` | `() => void` | Select handler |
| `ariaLabel` | `string` | Accessible name |

# Dependencies

- [SelectAgencyModal.md](../modals/SelectAgencyModal.md)
