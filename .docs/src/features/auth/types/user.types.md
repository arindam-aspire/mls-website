# File Overview

Logged-in user profile, roles, permissions, and `/auth/me` response types.

**Source:** `src/features/auth/types/user.types.ts`

# Exports

- `Permission`, `Role`, `LoggedInUser`, `LoggedInUserResponse`

# API Usage

| Type | Flow |
| --- | --- |
| `LoggedInUserResponse` | `GET /auth/me` |

# Dependencies

- [auth.store.md](../store/auth.store.md), [ProfilePopover.md](../../../layouts/public-layout/ProfilePopover.md)

# Notes

- `LoggedInUser` includes `roles` and nested `permissions` for future RBAC UI.
