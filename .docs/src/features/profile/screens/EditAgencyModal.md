# File Overview

Modal to update agency profile fields via `PUT /agency/{agencyId}`.

**Source:** `src/features/profile/screens/EditAgencyModal.tsx`

# UI Details

- `Modal` / `ModalPanel` use `size="xl"` (`max-w-4xl`); **no scroll** on `ModalContent` (`overflow-visible`).
- Compact form: `md` inputs, `lg:grid-cols-4` field grid, compact horizontal `LicenseDocumentUpload`.
- Submit in `ModalFooter` (linked to form via `requestSubmit` on `EDIT_AGENCY_FORM_ID`).

# API Usage

- `updateAgency` — `PUT` body: partial `UpdateAgencyRequest` (only keys whose values changed).
- Optional new license file → `POST /agency/{agencyId}/legal-document` (presigned) after PUT succeeds, via `LicenseDocumentUpload` in [EditAgencyForm.md](../components/EditAgencyForm.md).
- Success updates TanStack Query `["agency", agencyId]` cache.

# Flow

1. User clicks **Edit agency** on [AgencyProfileCard.md](../components/AgencyProfileCard.md).
2. Form pre-fills from unmasked `agency` prop (`agencySource` from `useProfileScreen`).
3. Submit → PUT → toast → modal closes; card refreshes from query cache.

# Dependencies

- [useEditAgencyModal.md](../hooks/useEditAgencyModal.md)
- [EditAgencyForm.md](../components/EditAgencyForm.md)
