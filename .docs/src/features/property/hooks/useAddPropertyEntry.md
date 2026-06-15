# File Overview

Encapsulates **Add Property** / **Create new** entry logic: redirect to property create when allowed, otherwise open the agency select modal.

**Source:** `src/features/property/hooks/useAddPropertyEntry.ts`

Used by **My Listings** (always checks `has_agency`) and **Draft Listings** (checks `has_agency` only for **owner** role).

# Responsibilities

- Read `user` from `useAuthStore`.
- On add/create: apply `has_agency` gate per options; navigate or open modal.

# Imports

- `isOwnerUser` from auth profile menu utils
- `useAuthStore`
- `useRouter` from `@/src/i18n/navigation`
- React `useState`, `useCallback`

# Exports

- `useAddPropertyEntry`
- `UseAddPropertyEntryOptions`

# Props / Parameters

| Option | Default | Description |
| --- | --- | --- |
| `restrictForOwnerOnly` | `false` | When `true`, only **owner** role is gated by `has_agency`; agents and others go straight to `/property-create` |

# State Management

- Local `isSelectAgencyOpen` boolean.
- User profile from Zustand auth store (`LoggedInUser.has_agency` optional API field).

# Navigation

- Success path: locale-aware `/property-create`.
- Blocked path: no navigation; modal opened instead.

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onAddProperty` | See flow below |
| `closeSelectAgency` | `setIsSelectAgencyOpen(false)` |

# Flow Description

1. Compute `shouldCheckHasAgency`:
   - `restrictForOwnerOnly === false` → always check (My Listings).
   - `restrictForOwnerOnly === true` → check only when `isOwnerUser(user)` (Draft Listings).
2. If `!shouldCheckHasAgency` **or** `user.has_agency === true` → `router.push("/property-create")`.
3. Else open `SelectAgencyModal`.

# Dependencies

- [ListingPropertyScreen.md](../screens/ListingPropertyScreen.md) — default options
- [DraftListingsScreen.md](../screens/DraftListingsScreen.md) — `{ restrictForOwnerOnly: true }`
- [SelectAgencyModal.md](../../profile/modals/SelectAgencyModal.md)

# Notes

- Uses strict equality (`=== true`) on `has_agency` so absent/unknown values trigger the modal when the gate applies.
