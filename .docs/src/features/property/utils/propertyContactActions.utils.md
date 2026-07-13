# File Overview

Opens agent and owner contact channels from property details data (`mailto:`, `tel:`, WhatsApp). Used by `usePropertyDetails` and wired into `@abdoun/abdoun-library` `PropertyView` contact callbacks.

**Source:** `src/features/property/utils/propertyContactActions.utils.ts`

# Responsibilities

- Resolve agent contact fields from `propertyDetails.agent` (`contact_actions` / `actions` with `enabled` + `href` when API provides them).
- Resolve owner contact fields from mapped owners (`resolvePropertyViewOwners`) with optional `ownerId` for multi-owner listings.
- For **guests**, when an agent contact action exists with `enabled: false`, open the auth modal (`AUTH_VIEW.chooseAccount`) instead of contact links.
- Open native email, phone, or WhatsApp URLs when the action is enabled or falls back to raw contact fields; no-op when missing.

# Imports

- `PropertyDetails` from `../types/property.types`
- `resolvePropertyViewOwners` from `../mappers/mapPropertyDetailsForPropertyView`
- `AUTH_VIEW`, `useAuthStore` from auth feature
- `tokenStore` from API core

# Exports

| Export | Purpose |
| --- | --- |
| `resolvePropertyDetailsAgent` | Agent `{ email, phone, whatsapp }` |
| `resolvePropertyDetailsOwner` | Owner contact by optional `ownerId` |
| `openPropertyAgentEmail` | `mailto:` for agent |
| `openPropertyAgentPhone` | `tel:` for agent |
| `openPropertyAgentWhatsApp` | `https://wa.me/…` for agent |
| `openPropertyOwnerEmail` | `mailto:` for owner |
| `openPropertyOwnerPhone` | `tel:` for owner |
| `openPropertyOwnerWhatsApp` | WhatsApp for owner |

# State Management

Reads auth state via `useAuthStore.getState()` and `tokenStore` (same gate as favourite toggle).

# API Usage

None — reads already-fetched `propertyDetails`.

# Navigation

- Auth modal via `useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount)` when guest clicks a disabled agent action
- `mailto:` and `tel:` via `window.location.href`
- WhatsApp via `window.open(..., "_blank", "noopener,noreferrer")`

# Props / Parameters

Contact openers accept `propertyDetails` and optional `ownerId` (owners only).

# Actions / Inputs

No UI — invoked from `PropertyView` Email / Call / WhatsApp buttons when MLS passes callbacks.

# UI Details

_N/A_

# Flow Description

1. User clicks Email, Call, or WhatsApp in library `ContactActions` (agent or owner block).
2. `PropertyView` invokes MLS callback with property id (and owner id when applicable).
3. `usePropertyDetails` delegates to these helpers.
4. Guest + agent action `enabled: false` → auth choose-account modal.
5. Otherwise uses API `href` when enabled, or raw email/phone/WhatsApp fallback.

# Dependencies

- [../mappers/mapPropertyDetailsForPropertyView.md](../mappers/mapPropertyDetailsForPropertyView.md)
- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)

# Notes

- WhatsApp prefers `agent.whatsapp` when set; otherwise falls back to phone digits.
- Owner WhatsApp uses owner phone (API has no separate whatsapp field on owners).
