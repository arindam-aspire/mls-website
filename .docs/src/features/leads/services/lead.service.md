# lead.service

### File Overview

API client wrappers for Lead Management (`/leads`).

### Responsibilities

List/detail CRUD-style helpers; normalize pagination; soft-fail list GETs for notes/messages/activity when endpoints are unavailable.

### API Usage

| Function | Method | Path |
| --- | --- | --- |
| `getLeadList` | GET | `/leads` |
| `getLeadDetail` | GET | `/leads/{id}` |
| `assignLeadAgent` | PATCH | `/leads/{id}/assign` |
| `updateLeadStatus` | PATCH | `/leads/{id}/status` |
| `requestCloseLead` | POST | `/leads/{id}/request-close` |
| `closeLead` | POST | `/leads/{id}/close` |
| `addLeadNote` | POST | `/leads/{id}/notes` |
| `addLeadMessage` | POST | `/leads/{id}/messages` |

### Exports

Service functions listed above.
