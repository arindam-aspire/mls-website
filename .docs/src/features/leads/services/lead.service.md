# lead.service

### File Overview

API client wrappers for Lead Management and owner-scoped enquiries. Used by the leads manager UI, owner My Inquiries, and property email inquiry (`createLead`).

### Responsibilities

- List/detail and lifecycle helpers (assign, status, close, notes, messages).
- Normalize owner-linked lead responses into the same list shape used by Lead Management.
- Accept both full lead records and the owner endpoint’s compact aliases (`name`, `email`, `phone`, `lead_no`, nested `lead`) without changing management normalization.
- Normalize list/detail lead records via `normalizeLeadFromApi` so embedded assignee names from API payloads are available to the UI.
- Soft-fail list GETs for notes/messages/activity when endpoints are unavailable.
- Create leads from property email inquiries; mock email send via console until the email API exists.

### API Usage

| Function | Method | Path | Auth |
| --- | --- | --- | --- |
| `getLeadList` | GET | `/leads` | yes |
| `getOwnerLeadList` | GET | `/agency/owners/{ownerId}/leads` | yes |
| `getLeadDetail` | GET | `/leads/{id}` | yes |
| `createLead` | POST | `/leads` | yes |
| `assignLeadAgent` | PATCH | `/leads/{id}/assign` | yes |
| `updateLeadStatus` | PATCH | `/leads/{id}/status` | yes |
| `requestCloseLead` | POST | `/leads/{id}/request-close` | yes |
| `closeLead` | POST | `/leads/{id}/close` | yes |
| `addLeadNote` | POST | `/leads/{id}/notes` | yes |
| `addLeadMessage` | POST | `/leads/{id}/messages` | yes |
| `getLeadNotes` | GET | `/leads/{id}/notes` | yes (soft-fail) |
| `getLeadMessages` | GET | `/leads/{id}/messages` | yes (soft-fail) |
| `getLeadActivity` | GET | `/leads/{id}/activity` | yes (soft-fail) |

### Exports

| Export | Notes |
| --- | --- |
| Service functions listed above | `getOwnerLeadList` accepts the same `LeadListParams` as `getLeadList` |
| `mockSendInquiryEmails` | Temporary: logs payload that would be emailed to agent + user; called after successful `createLead` |

### `createLead` body (`CreateLeadRequest`)

| Field | Notes |
| --- | --- |
| `source` | Required (e.g. `EMAIL_FORM` from property contact modal) |
| `property_hash` | Optional numeric hash of the listing |
| `message` | Inquiry message |
| `contact_name` / `contact_email` / `contact_phone` | Customer contact fields |
| `communication_mode` | e.g. `EMAIL` |
| `inquiry_type` | Optional |

### Notes

Replace `mockSendInquiryEmails` with the real `sendEmail` API when the email service is online (agent notification + user confirmation).
