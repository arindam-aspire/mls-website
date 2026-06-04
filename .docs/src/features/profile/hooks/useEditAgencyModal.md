# File Overview

Logic for [EditAgencyModal.md](../screens/EditAgencyModal.md): agency field form, optional license file selection, submit flow.

**Source:** `src/features/profile/hooks/useEditAgencyModal.ts`

# Responsibilities

- `useForm` validation for required name/trade name and optional website URL.
- Reset form and license file state when modal opens from `agency` prop.
- Show existing license filename via `licenseDocumentDisplayName`; replace when user picks a new file.
- On submit: build `UpdateAgencyRequest` with **only changed fields** (`editFormValuesToChangedUpdateAgencyRequest`); skip `PUT` if none changed. If a new license file was selected, `POST /agency/{id}/legal-document` after a successful `PUT` (or alone when only the file changed). Close with no API calls when nothing changed.

# Exports

- `useEditAgencyModal` — returns modal copy, `formProps` for `EditAgencyForm` (includes `licenseUpload`).

# Dependencies

- [EditAgencyForm.md](../components/EditAgencyForm.md)
- `@/src/components/common/LicenseDocumentUpload`
