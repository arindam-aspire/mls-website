# File Overview

Agency API path helpers.

**Source:** `src/apis/endpoints/agencyEndpoints.ts`

# Exports

| Key | Path |
| --- | --- |
| `byId(agencyId)` | `GET` / `PUT /agency/{agencyId}` |
| `logo(agencyId)` | `POST` / `DELETE /agency/{agencyId}/logo` (presigned upload + remove) |
| `legalDocument(agencyId)` | `POST /agency/{agencyId}/legal-document` (presigned license / legal document upload) |

# Notes

Used by `getAgencyById` in `profile.service.ts` (authenticated `apiClient`).
