# File Overview

Client hook for the profile screen: localized labels, change-password modal state, and separate edit email/phone modal state.

**Source:** `src/features/profile/hooks/useProfileScreen.ts`

# Responsibilities

- Provide `pageTitle`, `pageSubtitle`, and button labels via `profile` / `common` i18n.
- Build `myProfileCard` props (personal info fields, avatar, role). Agency users (`admin` / `agency` role): email and phone on the personal card are read-only (no `editLabel` / `onEdit`, no `verified` — no Verified / Not verified badges).
- Agency users: `useQuery` + `getAgencyById` in this hook → `GET /agency/:agency-id` when `user.agency.agency_id` is set; `agencyProfileCard.agency` uses API `data` or `user.agency` fallback. Email/phone on the agency card come from the logged-in user (`maskEmail` / `maskStoredPhoneNumber`), not agency contact fields.
- `useAgencyCurrencyPreference` + `useAgencyMeasurementUnitPreference` + `profile.displayPreferences` → currency (JOD/USD) and measurement (SQFT/SQM) option cards on the agency card.
- `showAgencyCardSkeleton` while agency query is pending/fetching.
- Own `isChangePasswordOpen`, `isEditEmailOpen`, `isEditPhoneOpen`.
- Expose `isLoading` when `isLoadingUser && !user` for `ProfileScreenSkeleton`.

# Exports

- `useProfileScreen`

# State Management

| State | Purpose |
| --- | --- |
| `isLoadingUser` (auth store) | Hydration from `GET /auth/me`; drives `isLoading` |
| `isChangePasswordOpen` | `ChangePasswordModal` visibility |
| `isEditEmailOpen` | `EditEmailModal` visibility |
| `isEditPhoneOpen` | `EditPhoneModal` visibility |

# Actions / Inputs

| Action | Handler |
| --- | --- |
| Change password | `openChangePassword()` |
| Edit email | `openEditEmail()` |
| Edit phone | `openEditPhone()` |

# Dependencies

- [ProfileScreen.md](../screens/ProfileScreen.md)
- [ProfilePageToolbar.md](../components/ProfilePageToolbar.md)
