# File Overview

Logic for `SelectAgencyModal`: fetch agency list, selection state, link agency on continue, redirect on success.

**Source:** `src/features/profile/hooks/useSelectAgencyModal.ts`

# Responsibilities

- `useQuery` → `getAgencyList({ skip: 0, limit: 50 })` when `isOpen`.
- Track `selectedAgencyId`; reset when modal closes.
- `onContinue` → `PATCH /users/agency` with `{ agencyId }` via `assignUserAgencyAndRefreshUser`; on success refresh auth user (`setUser`) and navigate to `/property-create?agency_id=…`.
- Toast on fetch error, assign error, or missing selection on continue.
- `isContinuePending` disables search, list selection, close, and shows loading on Continue.

# API Usage

| Method | Path | When |
| --- | --- | --- |
| GET | `/agency/list` | Modal open — list agencies |
| PATCH | `/users/agency` body `{ agencyId }` | Continue — link user to agency (auth required) |
| GET | `/auth/me` | After successful PATCH — refresh `has_agency` / user |

# Props / Parameters

| Param | Type | Description |
| --- | --- | --- |
| `isOpen` | `boolean` | Enables query and drives reset |
| `setIsOpen` | `Dispatch<SetStateAction<boolean>>` | Close modal |

# Dependencies

- [SelectAgencyModal.md](../modals/SelectAgencyModal.md)
- [user.service.ts](../../../../src/features/user/services/user.service.ts) — `assignUserAgency`, `assignUserAgencyAndRefreshUser`
- [profile.service.ts](../../../../src/features/profile/services/profile.service.ts) — re-exports the same functions for backward compatibility
