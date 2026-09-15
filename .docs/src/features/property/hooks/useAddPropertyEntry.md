# File Overview

Encapsulates **Add Property** / **Create new** entry logic: navigate to `/property-create`.

**Source:** `src/features/property/hooks/useAddPropertyEntry.ts`

Used by **My Listings** and **Draft Listings**.

# Responsibilities

- On add/create: `router.push("/property-create")`.
- Keep `isSelectAgencyOpen` for existing screen mounts of `SelectAgencyModal` (Owner no longer opens that modal before create).

# Imports

- `useRouter` from `@/src/i18n/navigation`
- React `useState`, `useCallback`

# Exports

- `useAddPropertyEntry`
- `UseAddPropertyEntryOptions`

# Props / Parameters

| Option | Default | Description |
| --- | --- | --- |
| `restrictForOwnerOnly` | `false` | Kept for existing callers. It no longer gates navigation; Owner opts into agency on the create form. |

# State Management

- Local `isSelectAgencyOpen` boolean (defaults `false`; Owner Add Property does not set it).

# Navigation

- Locale-aware `/property-create`.

# Actions / Inputs

| Callback | Behavior |
| --- | --- |
| `onAddProperty` | `router.push("/property-create")` |
| `closeSelectAgency` | `setIsSelectAgencyOpen(false)` |

# Flow Description

1. User clicks **Add Property** / **Create new**.
2. Navigate to `/property-create` for every role, including Owner.
3. Owner chooses **Verify through Agency** on Step 8 instead of picking an agency first.

# Dependencies

- [ListingPropertyScreen.md](../screens/ListingPropertyScreen.md) — default options
- [DraftListingsScreen.md](../screens/DraftListingsScreen.md) — `{ restrictForOwnerOnly: true }`
- [SelectAgencyModal.md](../../profile/modals/SelectAgencyModal.md) — still mounted by screens; no longer opened from this hook

# Notes

- Agency/Admin/Agent Add Property was already a direct navigate; that path is unchanged.
- Owner can still land on `/property-create?agency_id=` (legacy Select Agency continue URL); the create hook then turns routing on and hydrates the dropdown.
