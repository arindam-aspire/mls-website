# lead.mutation

### File Overview

TanStack Query mutation hooks for lead lifecycle actions and for creating a lead from a property email inquiry.

### Responsibilities

- Wrap `lead.service` mutations with React Query.
- Invalidate `["leads", …]` query keys after success.
- Show success/error toasts for manager actions (assign, status, close, notes, messages).
- `useCreateLead` invalidates list queries; the contact modal owns inquiry success/error toasts.

### Imports

- `@tanstack/react-query` — `useMutation`, `useQueryClient`
- `next-intl` — `useTranslations("leads.mutations")` (manager mutations)
- `@/src/hooks/useToast` — Shared Toaster
- `../services/lead.service` — API wrappers including `createLead`
- `../constants/leadList.constants` — `LEADS_QUERY_KEY`

### Exports

| Hook | Service | Toast |
| --- | --- | --- |
| `useCreateLead` | `createLead` | Handled by `useContactModal` (contact i18n) |
| `useAssignLeadAgent` | `assignLeadAgent` | yes |
| `useUpdateLeadStatus` | `updateLeadStatus` | yes |
| `useRequestCloseLead` | `requestCloseLead` | yes |
| `useCloseLead` | `closeLead` | yes |
| `useAddLeadNote` | `addLeadNote` | yes |
| `useAddLeadMessage` | `addLeadMessage` | yes |
| `useRejectCloseLead` | `updateLeadStatus` → `IN_PROGRESS` | yes |

### State Management

React Query mutations only; no Zustand store.

### API Usage

See `lead.service.md`. `useCreateLead` posts `CreateLeadRequest` to `POST /leads`.

### Navigation

None.

### Props / Parameters

Mutation variables match the corresponding service function arguments (see type imports from `lead.types.ts`).

### Flow Description

1. UI (contact modal or lead details) calls `mutate` / `mutateAsync`.
2. On success: invalidate list (+ detail/notes/messages/activity when `leadId` is known).
3. Manager hooks toast with `leads.mutations.*` keys.
4. Property inquiry: `useContactModal` awaits `useCreateLead().mutateAsync`, then toasts `contact.inquirySuccess*` / `contact.errors.inquiryError*`.

### Dependencies

- `src/features/leads/services/lead.service.ts`
- `src/features/contact/hooks/useContactModal.ts` (consumer of `useCreateLead`)
- Lead detail/list screen hooks for manager mutations

### Notes

Email outbound after create is mocked in `createLead` / `mockSendInquiryEmails` until the email API ships.
