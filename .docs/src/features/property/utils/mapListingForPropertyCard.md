# File Overview

Maps a `PropertyListing` for library Grid/List cards: hide owners, show agency/agent names, keep real contact on `cardContact`.

**Source:** `src/features/property/utils/mapListingForPropertyCard.ts`

# Responsibilities

- Strip `owners` so the library owner chip never appears even if `canViewOwners` were enabled.
- Resolve real agent/agency contact via `resolveListingCardContact` (agent first, then agency, never owner).
- When an **agency name** exists, put it in `agent.name` (library agent-block title).
- When **both** agency and agent names exist, put the agent name in `agent.email` (library agent-block subtitle). `agent.phone` is cleared so the subtitle is the agent name.
- When only one name exists, keep real `agent.phone` / `agent.email` as the subtitle.
- Attach `cardContact` so Email / Call / WhatsApp use real addresses, not display-mapped fields.

# Imports

- `PropertyCardContact`, `PropertyListing` from `../types/property.types`
- `listingHasContactAgent` from `./propertyContactActions.utils`

# Exports

| Export | Purpose |
| --- | --- |
| `resolveListingCardContact` | Agent-first contact snapshot (`name`, `email`, `phone`, `whatsapp`, `hasSourceAgent`) |
| `mapListingForPropertyCard` | Card-safe listing for `PropertyListingCardList` |

# State Management

_N/A — pure functions._

# API Usage

_N/A — uses fields already on the listing (`agency.agency_name`, `agent.name`, contact fields)._

# Navigation

_N/A._

# Props / Parameters

| Function | Args | Returns |
| --- | --- | --- |
| `resolveListingCardContact` | `PropertyListing` | `PropertyCardContact` (returns existing `cardContact` when set) |
| `mapListingForPropertyCard` | `PropertyListing` | Listing with `owners: []`, `cardContact`, display `agent` |

# Actions / Inputs

_N/A._

# UI Details

Library GridCard / ListCard agent block:

| Line | When both names exist | When only agent or only agency |
| --- | --- | --- |
| Title (`agent.name`) | Agency name | The one name that exists |
| Subtitle (`agent.phone \|\| agent.email`) | Agent name | Real phone or email |

Missing agency or agent: that line is omitted (no agent block if neither name exists). Missing email/phone does not break the card.

# Flow Description

1. `PropertyListingCardList` maps each item before `PropertyCardList`.
2. Click handlers read `cardContact` (via `mapListingToContactContext`) rather than display `agent.email`.

# Dependencies

- [propertyContactActions.utils.md](./propertyContactActions.utils.md)
- [PropertyListingCardList.md](../components/PropertyListingCardList.md)
- [../../contact/README.md](../../contact/README.md)

# Notes

- Call `mapListingForPropertyCard` once per listing. A second pass would treat the remapped `agent.name` as the agent name.
- Grid and List share this mapper so both views stay consistent.
