# File Overview

Profile and agency HTTP helpers. Super-admin offline agency creation lives here: upload a legal document via MLS presign, then `POST /agency/offline-registration`.

**Source:** `src/features/profile/services/profile.service.ts`

# Responsibilities

- Agency CRUD, list, logo/legal-document uploads, invitations, review, activation, password links.
- Profile update, OTP verify, and profile-picture upload/delete.
- Offline registration: presign (`agency_legal_document`) → **PUT** bytes to S3 → persist canonical `file_url` as `legal_document_s3_link`.

# Imports

- `apiClient` / `authClient`
- `agencyEndpoints`, `profileEndpoints`
- `requestUploadPresignedUrl`
- `putFileToPresignedUrl`, `resolvePersistedUploadReference`, `resolveUploadedFileUrl`
- `isUsableNextImageSrc`
- Local helper `putFileUnlessDevPlaceholder` — skips the storage PUT when `upload_url` is a `dev://` placeholder; honors `upload_http_method`
- `resolveDisplayUrlAfterUpload` — prefers a usable stored URL, then `signed_read_url` / `file_url` from the upload payload

# Exports

| Function | Role |
| --- | --- |
| `getAgencyById` / `getAgencyList` | Authenticated agency read |
| `updateAgency` | `PUT /agency/{id}` |
| `createOfflineAgency` | Super-admin `POST /agency/offline-registration` |
| `uploadOfflineAgencyLegalDocument` | Presign + PUT + persistable URL |
| `createAgencyInvitation` | Super-admin invitations |
| `reviewAgency` / `updateAgencyActivation` / `sendAgencyPasswordLink` | Workflow |
| `setupAgencyPassword` | Public password setup |
| `updateProfile` / `requestProfileUpdate` / `verifyProfileUpdate*` | Profile |
| `uploadProfilePicture` / `deleteProfilePicture` | Personal avatar |
| `uploadAgencyLogo` / `deleteAgencyLogo` | Agency logo |
| `uploadAgencyLegalDocument` | Existing-agency license (agency-scoped presign) |

# State Management

None. Callers use React Query / Zustand.

# API Usage

## Super-admin offline registration

Auth: Bearer (super admin). Used from `AgenciesScreen`.

1. **POST** `/uploads/presigned-url`

```json
{
  "context": "agency_legal_document",
  "file_name": "license.pdf",
  "content_type": "application/pdf",
  "file_size": 102400
}
```

Success `data` includes `upload_url`, `upload_http_method: "PUT"`, `object_key`, canonical `file_url`, and `signed_read_url` (preview only).

2. **PUT** raw file bytes to `upload_url` (no `Authorization`). POSTing here fails with 403 after a successful presign because S3 signed **PUT**.

3. **POST** `/agency/offline-registration` with form fields plus `legal_document_s3_link` = `resolvePersistedUploadReference` (`file_url` → `object_key` → stripped `upload_url`). Do not send `signed_read_url` (it expires).

Success: `{ agency, password_setup_token, password_setup_link }` (password fields are typically null until verification).

Errors: `401`, `403`, `409` (duplicate email), `422`.

Super admins often have no `agency_id`. The backend then keys the object as `agency_legal_document/{user_id}/{uuid}-{filename}`. That is expected for offline create.

## Profile picture

Auth: Bearer. Used from `useProfileAvatarUpload` on `/en/my-profile`.

1. **POST** `/auth/me/profile-picture` with `{ file_name, content_type, file_size }`.
2. Success `data` includes `upload_url` (S3 presigned or `dev://…`). Optional `upload_http_method`, `signed_read_url`, `file_url`, `object_key`.
3. Browser **PUT**s (or **POST**s when `upload_http_method` is `POST`) raw file bytes to `upload_url` **only** when it is HTTP(S). `dev://` URLs are skipped — `fetch`/`XHR` cannot open that scheme and would surface as `Upload failed. Check file type, presigned URL expiry, or storage CORS.`
4. **GET** `/auth/me` refreshes `profile_picture_url`. If that value is not a loadable HTTP(S) URL, the service prefers `signed_read_url` / `file_url` from the upload payload.
5. The upload hook also sets a same-session `blob:` preview and stores the file in IndexedDB so `GET /auth/me` after login can restore it when MLS only stored `dev://`.

Agency logo (`POST /agency/{id}/logo`) uses the same PUT skip and `signed_read_url` / `file_url` overlay on `logo_url`. Existing-agency legal document (`POST /agency/{id}/legal-document`) uses the same skip.

Local/dev: after a successful POST the stored URL is often still `dev://…`. `Avatar` cannot load that scheme. The app caches the file in IndexedDB and restores a `blob:` URL on login. A visible photo on another device needs a real HTTP(S) storage URL (S3 configured on the API).

# Navigation

No navigation. `AgenciesScreen` is at locale-prefixed `/en/agencies` (super admin).

# Props / Parameters

`uploadOfflineAgencyLegalDocument(file: File): Promise<string>` — persistable S3 URL / object key.

`createOfflineAgency(body: AgencyOfflineRegistrationRequest)` — required `agency_name`, `agency_trade_name`, `email`, `phone`; optional address/currency and `legal_document_s3_link`.

# Actions / Inputs

Owned by `AgenciesScreen` (offline form). This module only performs HTTP and S3 PUT.

# UI Details

Not a UI module.

# Flow Description

1. Super admin submits offline form + legal document.
2. `uploadOfflineAgencyLegalDocument` requests a PUT-signed URL.
3. Browser PUTs the file to S3.
4. `createOfflineAgency` stores the canonical `file_url` on the new pending agency.
5. List queries are invalidated by the screen.

# Dependencies

- `AgenciesScreen` (`createOfflineMutation`)
- [upload.md](../../../lib/upload.md), [resolveUploadedFileUrl.md](../../../lib/resolveUploadedFileUrl.md)
- [agencyEndpoints.md](../../../apis/endpoints/agencyEndpoints.md)

# Notes

- `dev://` upload URLs skip the storage PUT (local/dev mode). Profile picture, agency logo, and agency legal-document uploads share `putFileUnlessDevPlaceholder`.
- Existing-agency `uploadAgencyLegalDocument` uses `POST /agency/{id}/legal-document` then the same PUT helper.
- `sendAgencyPasswordLink` (`POST /agency/{id}/password-link`) returns `password_setup_link` (often with a backend-configured host). On **Password Link** in `AgenciesScreen`, that URL is rewritten onto `window.location.origin` while keeping `/[locale]/agency-password-setup?token=…`. A blank tab is then navigated to the rewritten URL. The same URL is stored on the screen’s copy bar.
