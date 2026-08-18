# File Overview

Owner-only My Inquiries screen that reuses the shared Lead List UI.

**Source:** `src/features/property/screens/InquiriesScreen.tsx`

# Responsibilities

- Read the hydrated authenticated user and branch by role.
- Render loading while auth hydration completes.
- Call `useLeadsScreen({ scope: "owner" })`.
- Render existing lead search/status filters, sorting, pagination, loading and empty states.
- Keep the list read-only; agency/agent lead detail actions remain exclusive to `/leads`.
- Preserve the existing localized Coming Soon card for authenticated non-owner roles.

# Imports

- `useAuthStore`, `isOwnerUser`, `useLeadsScreen`, `LeadList`, `ComingSoonCard`

# Exports

- `InquiriesScreen`
- `default`

# State Management

_No significant state; presentational or config module._

# API Usage

`GET /agency/owners/{loggedInUser.id}/leads` through `getOwnerLeadList`, with page, page size, search, status and supported list sort/filter query parameters.

# Navigation

_No direct navigation._

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

## Inputs

- Search text (debounced)
- Status filter
- Sort controls
- Pagination

## Actions

- Search/filter/sort the owner’s enquiries.
- Change pages.

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

1. Wait for auth hydration.
2. For Owner, pass the logged-in user id to the owner-scoped lead-list service.
3. Map the response into the shared `LeadListRow` model.
4. Render `LeadList` without management detail actions.
5. For Agent/Admin and other authenticated non-owner roles, retain the previous Coming Soon behavior and make no owner API request.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/property/screens/InquiriesScreen.tsx` changes.
