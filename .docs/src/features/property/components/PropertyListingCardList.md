# File Overview

Shared wrapper around `@abdoun/abdoun-library` `PropertyCardList` for MLS browse cards (Grid View and List View).

**Source:** `src/features/property/components/PropertyListingCardList.tsx`

# Responsibilities

- Hide owner chips on every card (`canViewOwners={false}`).
- Show the library agent block (`canViewAgents`) so Agency Name and/or Agent Name can appear.
- Map each listing with `mapListingForPropertyCard` before passing data to the library (same mapping for grid and list).
- Add a List View-only class and scoped layout rule that keeps the contact action group right-aligned.
- Forward all other `PropertyCardList` props (layout, toolbar, pagination, contact/favourite handlers).

# Imports

- `PropertyCardList` from `@abdoun/abdoun-library`
- `mapListingForPropertyCard` from `../utils/mapListingForPropertyCard`
- `PropertyListing` from `../types/property.types`

# Exports

- `PropertyListingCardList`
- `PropertyListingCardListProps`

# State Management

Local `useMemo` for mapped `data` only. List fetch, layout toggle, and contact handlers stay in screen hooks.

# API Usage

_N/A — receives already-normalized `PropertyListing[]`._

# Navigation

Delegated to `onClick` / contact callbacks from the parent screen hook.

# Props / Parameters

Same as library `PropertyCardList` except:

| Prop | Notes |
| --- | --- |
| `data` | App `PropertyListing[]` (mapped internally) |
| `canViewOwners` | Not accepted — always `false` |
| `canViewAgents` | Not accepted — always `true` |

# Actions / Inputs

- **Email / Call / WhatsApp** — host callbacks (`usePropertyContactModalActions`); library does not open `mailto` / `tel` / `wa.me`.
- **Favourite / delete / card click** — forwarded unchanged.
- **Grid / list toggle** — `toolbar.onViewChange` from `usePropertyList` (property list only).

# UI Details

- Library GridCard / ListCard shells, semantic tokens, `rounded-xl` cards, `rounded-lg` buttons.
- Agent block (library): avatar + name line + detail line. MLS mapping puts **agency name** on the name line when present, and **agent name** on the detail line when both exist.
- In List View, the agent/agency block stays at the left while Email, Call, and WhatsApp remain in one row aligned to the far right. The action row retains full width below `sm` and becomes content-width from `sm` upward.
- The scoped `mls-property-list-view` rule is attached only when `layoutVariant === "list"`, so Grid View styling is unchanged.
- Owners section is not rendered.
- Loading skeletons follow `canViewOwners={false}` / `canViewAgents` via the library.

# Flow Description

1. Screen passes listings plus layout (`grid` \| `list`) and handlers.
2. Wrapper maps listings (strip owners, attach `cardContact`, remap agent display fields).
3. `PropertyCardList` renders `CardGridView` → `GridCard` or `CardListView` → `ListCard`.
4. Contact clicks receive the mapped listing (with `cardContact`) and are handled in the app.

# Dependencies

- [mapListingForPropertyCard.md](../utils/mapListingForPropertyCard.md)
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)
- [../screens/FavouritePropertyScreen.md](../screens/FavouritePropertyScreen.md)
- [../screens/RecentlyViewedScreen.md](../screens/RecentlyViewedScreen.md)

# Notes

- Display remapping is an MLS boundary adapter. `@abdoun/abdoun-library` GridCard/ListCard do not render `agency.agency_name` as its own field.
- Suggested upstream: labeled Agency Name / Agent Name rows on both layouts, without using `agent.email` as a display slot.
