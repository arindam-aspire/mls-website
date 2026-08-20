# File Overview

Agency path helpers used by `profile.service.ts` and agency screens.

**Source:** `src/apis/endpoints/agencyEndpoints.ts`

# Exports

| Key | Path |
| --- | --- |
| `LIST(params)` | `GET /agency/list` |
| `OFFLINE_REGISTRATION` | `POST /agency/offline-registration` (super admin) |
| `INVITATIONS` | `POST /agency/invitations` |
| `PASSWORD_SETUP` | `POST /agency/password/setup` (public) |
| `review(agencyId)` | `POST /agency/{agencyId}/review` |
| `activation(agencyId)` | `POST /agency/{agencyId}/activation` |
| `passwordLink(agencyId)` | `POST /agency/{agencyId}/password-link` |
| `byId(agencyId)` | `GET` / `PUT /agency/{agencyId}` |
| `logo(agencyId)` | `POST` / `DELETE /agency/{agencyId}/logo` (presigned upload + remove) |
| `legalDocument(agencyId)` | `POST /agency/{agencyId}/legal-document` (presigned license / legal document upload) |

# Notes

Used by `getAgencyById`, `createOfflineAgency`, and related helpers in `profile.service.ts` (authenticated `apiClient` except password setup).
