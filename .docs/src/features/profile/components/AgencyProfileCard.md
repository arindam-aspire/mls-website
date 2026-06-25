# File Overview

Agency account summary card: header row with logo (left, upload/remove) and agency name + trade name (right), then read-only detail rows (license, contact, email/phone, website, address).

**Source:** `src/features/profile/components/AgencyProfileCard.tsx`

# Responsibilities

- Header: logo left (centered below `lg`); **`agency_name`** / **`agency_trade_name`** on `lg+`; **email | phone** from the logged-in **`user`** contact (masked display strings); **Edit agency** button opens [EditAgencyModal.md](../screens/EditAgencyModal.md).
- Detail area: **`sectionTitle`**, then a single field grid (no subsection borders or titles). One column by default; from `lg` two columns — primary contact + license on one row; email + phone on the next; website and address each span full width (`lg:col-span-2`). License upload in [EditAgencyModal.md](../screens/EditAgencyModal.md).
- Display preferences (currency, measurement unit) live on [AgencySettingsScreen.md](../screens/AgencySettingsScreen.md), not on this card.
- Render agency business fields from the `agency` prop; contact name, email, and phone from `user` (`AgencyProfileCardUser`) and translated `labels`.
- Derive license display filename from `legal_document_s3_link` via `licenseDocumentDisplayName` (URL pathname or last segment).
- When a document URL exists, show a **Download** `IconButton` that opens `legal_document_s3_link` in a new tab (`downloadLicenseDocument` aria-label).
- Format address from `address`, `city`, `state`, `zip_code`, `country` (comma-separated; omit empty parts).
- **Email and phone** rows: verification from `user.is_email_verified` / `user.is_phone_verified`; phone badge omitted when `user.hasPhone` is false; optional edit when parent passes `onEditEmail` / `onEditPhone`.
# Imports

- `lucide-react` icons
- `@/src/components/ui` — `Card`, `CardContent`
- `./ProfileAvatarUpload` — shared avatar upload UI
- `@/src/components/ui/icon-button` — `IconButton`
- `@/src/lib/cn`, `@/src/lib/typography` — `headingSectionClasses`
- `../types/profile.types` — `Agency`, `AgencyProfileCardProps`, `AgencyProfileCardUser`
- `../utils/agencyForm.utils` — `toExternalWebsiteHref`

# Exports

- `AgencyProfileCard`
- `AgencyProfileCardProps` (re-export type)

# State Management

Presentational only; no local state.

# API Usage

_N/A._ Parent passes `Agency` from `GET /agency/:id` (via `useProfileScreen`) or a summary built from `user.agency` on `/auth/me`. User contact comes from `useAuthStore` / `LoggedInUser`.

# Navigation

_N/A._

# Props / Parameters

See `AgencyProfileCardProps` in `profile.types.ts`:

| Prop | Description |
| --- | --- |
| `agency` | Full `Agency` object (names, website, address, license link, logo, etc.) — not used for email/phone display |
| `user` | `AgencyProfileCardUser` — masked `emailDisplay` / `phoneDisplay`, `full_name`, verification flags |
| `sectionTitle` | Card section heading |
| `labels` | `AgencyProfileCardLabels` — row labels, status strings, `notProvided` |
| `uploadLogoLabel` / `removeLogoLabel` | Logo upload copy |
| `avatarUpload` | `ProfileAvatarUploadBindings` from `useAgencyLogoUpload` |
| `verifiedLabel` / `notVerifiedLabel` | Badge copy for email/phone rows |
| `editEmailLabel` / `editPhoneLabel` | `aria-label` for edit buttons |
| `onEditEmail` / `onEditPhone` | Open profile edit modals (parent hook) |
| `onEditAgency` | Open edit agency modal |

Display preferences were moved to [AgencySettingsScreen.md](../screens/AgencySettingsScreen.md).

# Actions / Inputs

- Logo: camera opens file picker; remove overlay when a logo exists.
- Edit email/phone: `IconButton` calls `onEditEmail` / `onEditPhone` when labels and handlers are provided.
- Edit agency: ghost button in header.

# UI Details

- Shared `Card` with `profileCardClassName` (`w-full max-w-md`, `lg:max-w-none` on agency card).
- Logo: same as personal card — `size-28` / `sm:size-32`, `rounded-full`, `border-secondary/15`; semantic tokens only.
- Field rows: icon box `rounded-lg bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70`, `text-muted` label, `text-text` value; verification/status pills use `bg-success/15` / `bg-danger/10`.
- Website row: external link when URL is valid (`toExternalWebsiteHref`).
- Light/dark via theme tokens; responsive layout per [responsive-design](../../../../.cursor/rules/responsive-design.mdc).

# Flow Description

1. `useProfileScreen` builds `agencySource` from agency query or `LoggedInUserAgency` fallback; builds `user` slice with `maskEmail` / `maskStoredPhoneNumber` (same as personal profile).
2. `ProfileScreen` renders `<AgencyProfileCard {...agencyProfileCard} />` when props exist (skeleton while loading without fallback).
3. Card maps agency fields and user contact fields to `AgencyDetailField` / header contact items.

# Dependencies

- [MyProfileCard.md](./MyProfileCard.md) — parallel personal card; same masking for contact
- [ProfileAvatarDisplay.tsx](../../../../src/features/profile/components/ProfileAvatarDisplay.tsx) — shared avatar UI
- [profile.types.ts](../types/profile.types.ts) — `Agency`, `AgencyProfileCardUser`, card props
- [useProfileScreen.md](../hooks/useProfileScreen.md) — props builder
- [useAgencyLogoUpload.md](../hooks/useAgencyLogoUpload.md) — logo upload/remove logic
- [ProfileScreen.md](../screens/ProfileScreen.md) — layout consumer

# Notes

- `remotePatterns` in `next.config` must allow S3 (or CDN) hosts for presigned logo URLs.
- Agency record `email` / `phone` may differ from the logged-in user; the card intentionally shows **user** contact for email/phone rows and header.
- Presigned upload body: `{ file_name, content_type, file_size }` (same shape as profile picture).
