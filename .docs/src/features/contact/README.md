# Contact feature

Reusable Email / WhatsApp / Call contact modal used by property list, details, favourites, recently viewed (and available for leads).

## Flow

1. User clicks Email / WhatsApp / Call on a card or PropertyView.
2. App maps listing/details → `ContactModalContext` and opens `ContactModal` via `useContactModal` / `usePropertyContactModalActions`.
3. Email/WhatsApp: validate form → `mailto:` or `wa.me?text=`.
4. Call: show details → confirm → `tel:`.

## Recipient resolution

| Entry point | Recipient |
| --- | --- |
| Property card Email / Call / WhatsApp | Requires `listing.agent`; otherwise opens auth (`chooseAccount`). Then **agent first** for `To` / `Sent to`, then `brokerName`, then agency, then first owner |
| Property details agent actions | Requires agent on details; otherwise auth. Then mapped agent (`mapPropertyDetailsAgentToContactContext`) |
| Property details owner actions | Mapped owner |

Email / WhatsApp form phone field uses shared `PhoneInput` (country **flag** selector + national number), not a plain dial-code text input. Prefill parses `user.phone_number` via `parseStoredPhoneNumber`.

## Key files

| File | Role |
| --- | --- |
| `components/ContactModal.tsx` | UI (`PhoneInput` for customer phone; `ModalDescription` / `ModalContent` use `px-4 sm:px-6`) |
| `hooks/useContactModal.ts` | Form / validation / launch (`setPhone` updates country + national + formatted `phone`) |
| `hooks/usePropertyContactModalActions.ts` | Property wiring helpers |
| `mappers/mapContactModalContext.ts` | Listing/details → context (card: agent-first for To / Sent to) |
| `mappers/mapLeadToContactContext.ts` | Lead → context |

No abdoun-library change required: library already passes `(listing) => void` / agent-owner callbacks to the app.
