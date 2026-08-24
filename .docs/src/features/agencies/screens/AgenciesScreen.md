# File Overview

Super-admin agency management screen (create, invite, review, activate).

**Source:** `src/features/agencies/screens/AgenciesScreen.tsx`

# Responsibilities

- Render the paginated agency registry for Super Admin usage.
- Provide **Offline Registration** (create agency + upload legal document).
- Provide **Invitation Registration** (create an agency invitation link).
- Allow Super Admin to **approve/reject** pending agencies.
- Allow Super Admin to **activate/deactivate** approved/verified agencies.
- Generate/copy **password setup links** for eligible agencies.
- Refresh the agency list after successful mutations.

# Imports

- React + React Query: `useState`, `useMemo`, `useMutation`, `useQuery`, `useQueryClient`.
- Profile service APIs from `src/features/profile/services/profile.service`:
  - `getAgencyList`, `createOfflineAgency`, `createAgencyInvitation`
  - `reviewAgency`, `updateAgencyActivation`
  - `uploadOfflineAgencyLegalDocument`, `sendAgencyPasswordLink`
- UI components:
  - `PhoneInput`, `Input`, `Button`, `CopyLinkBar`, `LicenseDocumentUpload`
- Utilities:
  - `validateLicenseDocumentFile`
  - `cn` (className helper)

# Exports

- `AgenciesScreen` (default export): route-level screen content.

# State Management

- Local UI state via `useState`:
  - Offline registration form fields and selected legal document file.
  - Invitation form fields.
  - Pagination/search/sorting/filter values.
  - Latest generated link (copy bar input).
  - Phone input internal values (country code + national number) for both forms.
- React Query state:
  - `getAgencyList` query drives the registry table.

# API Usage

## Fetch

| Operation | Endpoint | Auth | Notes |
| --- | --- | --- | --- |
| Agency list | `GET /agency/list` | `auth: true` | Supports pagination + search + filters. |

## Mutations

| Action | Service function | HTTP method | Notes |
| --- | --- | --- | --- |
| Offline agency registration | `createOfflineAgency` | `POST /agency/offline-registration` | Uploads legal document via `uploadOfflineAgencyLegalDocument` first. |
| Generate invitation link | `createAgencyInvitation` | `POST /agency/invitations` | Stores API-returned invitation URL in the copy bar. |
| Review agency | `reviewAgency` | `POST /agency/{id}/review` | Used for approve/reject. |
| Activate/deactivate | `updateAgencyActivation` | `POST /agency/{id}/activation` | Toggles `is_active`. |
| Generate password setup link | `sendAgencyPasswordLink` | `POST /agency/{id}/password-link` | Stores `password_setup_link` in the copy bar and optionally opens a new tab. |

# Navigation

- This screen does not define routes.
- It opens password setup links using `window.open()` so that the user is taken to the existing password setup page:
  - `/[locale]/agency-password-setup?token=...`

# Actions / Inputs

## Agency list table

- Inputs:
  - Search input
  - Agency status filter (`active` / `inactive`)
  - Verification status filter
  - Sort order
  - Rows (page size)
- Actions:
  - Refresh list (manual invalidation)
  - Approve / Reject pending agencies
  - Activate / Deactivate agencies
  - Generate / copy password setup link

## Offline Registration

- Inputs:
  - Agency name, trade name, email
  - Phone (country code + national number)
  - Legal document file upload
  - Optional: website, city, country (and other nullable fields supported by the request type)
- Actions:
  - Submit form → uploads the legal document to S3 (via existing helper) → calls `createOfflineAgency`

## Invitation Registration

- Inputs:
  - Email, optional agency name, optional trade name
  - Phone (country code + national number)
- Actions:
  - Submit form → calls `createAgencyInvitation`
  - On success: refresh agency list so the new invitation/registration state is visible.

# UI Details

- Layout uses responsive, mobile-first grid/table behavior:
  - KPI/form sections stack vertically and split into columns on `sm:`/`lg:` breakpoints.
- Uses semantic theme tokens as provided by the shared UI components:
  - Card surfaces: `bg-surface`, borders `border-secondary/15`, etc.
- Consistent borders and radii:
  - Containers/cards use `rounded-lg` as implemented in the screen.
- Phone input:
  - Uses the shared `PhoneInput` component to sanitize national number digits and compose the final `dialCode + digits` phone format.

# Flow Description

1. **Load** the agency registry with `getAgencyList` based on current pagination + filters.
2. **Offline Registration**:
   - User selects a legal document.
   - Submit triggers license file validation, uploads the document, then calls `createOfflineAgency`.
   - On success: resets form state, updates latest generated password link (if returned), and invalidates the list.
3. **Invitation Registration**:
   - Submit calls `createAgencyInvitation`.
   - On success:
     - refreshes the agency list
     - normalizes the returned invitation URL (if the backend returns a non-localized or token-only URL)
     - shows the link in the copy bar.
4. **Agency Review**:
   - Pending agencies can be approved or rejected via `reviewAgency`.
   - On success: list is refreshed and any returned password link is displayed.
5. **Activation**:
   - Approved/verified agencies can be toggled active/inactive.
   - On success: list is refreshed.
6. **Password Setup Link Visibility**:
   - The “Password Link” action is shown only for agencies with status `APPROVED` (hidden once the status becomes `ACTIVE`).

# Dependencies

- Parent route:
  - `app/[locale]/(main)/agencies/page.tsx` renders this screen.
- Child components:
  - `CopyLinkBar`, `LicenseDocumentUpload`, `PhoneInput`, and UI primitives.

# Notes

- Invitation URL normalization is handled locally in this file to ensure the user lands on the correct existing password setup route with the current locale prefix.
- This screen intentionally reuses existing service functions and UI primitives; no new backend endpoints were introduced.

