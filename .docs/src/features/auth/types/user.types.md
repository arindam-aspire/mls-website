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

# API Usage

| Type | Flow |
| --- | --- |
| `LoggedInUserResponse` | `GET /auth/me` |

# Dependencies

- [auth.store.md](../store/auth.store.md), [ProfilePopover.md](../../../layouts/public-layout/ProfilePopover.md)

# Notes

- `LoggedInUser` includes `roles` and nested `permissions` for future RBAC UI.
