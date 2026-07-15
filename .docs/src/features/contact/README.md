# Contact feature

Reusable Email / WhatsApp / Call contact modal used by property list, details, favourites, recently viewed (and available for leads).

## Flow

1. User clicks Email / WhatsApp / Call on a card or PropertyView.
2. App maps listing/details → `ContactModalContext` and opens `ContactModal` via `useContactModal` / `usePropertyContactModalActions`.
3. **Email (property inquiry)** — when `context.createsLead` is true:
   - Validate form (name, email, message).
   - Require auth (`createLead` needs a token); otherwise open choose-account.
   - Call `useCreateLead` → `POST /leads` with `source: "EMAIL_FORM"`.
   - Service layer mocks outbound email with `console.log` (`mockSendInquiryEmails`) until the email API exists.
   - Show success toast via Shared Toaster (`useToast`), then close the modal.
4. **Email (lead customer)** — when `createsLead` is omitted/false: validate → `mailto:`.
5. WhatsApp: validate form → `wa.me?text=`.
6. Call: show details → confirm → `tel:`.

## Recipient resolution

| Entry point | Recipient |
| --- | --- |
| Property card Email / Call / WhatsApp | Requires `listing.agent`; otherwise opens auth (`chooseAccount`). Then **agent first** for `To` / `Sent to`, then `brokerName`, then agency, then first owner |
| Property details agent actions | Requires agent on details; otherwise auth. Then mapped agent (`mapPropertyDetailsAgentToContactContext`) |
| Property details owner actions | Mapped owner |

Property listing/details mappers also set `propertyHash` + `createsLead: true` so Send creates a lead. `mapLeadToContactContext` does **not** set `createsLead` (agent emails the customer via mailto).

Email / WhatsApp form phone field uses shared `PhoneInput` (country **flag** selector + national number), not a plain dial-code text input. Prefill parses `user.phone_number` via `parseStoredPhoneNumber`.

## Key files

| File | Role |
| --- | --- |
| `components/ContactModal.tsx` | UI (`PhoneInput` for customer phone; `ModalDescription` / `ModalContent` use `px-4 sm:px-6`) |
| `hooks/useContactModal.ts` | Form / validation / submit (`createLead` for property email; mailto / wa.me / tel otherwise) |
| `hooks/usePropertyContactModalActions.ts` | Property wiring helpers |
| `mappers/mapContactModalContext.ts` | Listing/details → context (agent-first To / Sent to; `propertyHash` + `createsLead`) |
| `mappers/mapLeadToContactContext.ts` | Lead → context (no lead creation on Send) |

No abdoun-library change required: library already passes `(listing) => void` / agent-owner callbacks to the app.
