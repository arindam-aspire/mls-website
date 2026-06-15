# File Overview

Logged-in user profile, roles, permissions, and `/auth/me` response types.

**Source:** `src/features/auth/types/user.types.ts`

# Exports

- `Permission`, `Role`, `LoggedInUserAgency`, `LoggedInUser`, `LoggedInUserResponse`

# `LoggedInUserAgency` (nested on `/auth/me`)

| Field | Type |
| --- | --- |
| `agency_id` | `string` — used for `GET /agency/:agency-id` |
| `agency_name` | `string` |
| `agency_trade_name` | `string` |
| `email` | `string` |
| `phone` | `string` |
| `website` | `string \| null` |

`LoggedInUser.agency` is optional; present for agency portal users.

# `LoggedInUser` (`GET /auth/me` data)

| Field | Type | Notes |
| --- | --- | --- |
| `has_agency` | `boolean` (optional) | Whether the user is linked to an agency (independent of nested `agency` summary) |
| `agency` | `LoggedInUserAgency \| null \| undefined` | Agency summary when present |
| `email` | `string` | Login email |
| `full_name` | `string` | Display name |
| `phone_number` | `string` | E.164 or stored phone |
| `roles` | `Role[]` | Assigned roles with permissions |

# API Usage

| Type | Flow |
| --- | --- |
| `LoggedInUserResponse` | `GET /auth/me` |

# Dependencies

- [auth.store.md](../store/auth.store.md), [ProfilePopover.md](../../../layouts/public-layout/ProfilePopover.md)

# Notes

- `has_agency` indicates agency membership from the API; use with nested `agency` for profile and listing flows.
- `LoggedInUser` includes `roles` and nested `permissions` for future RBAC UI.
