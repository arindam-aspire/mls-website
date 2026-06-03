# File Overview

`src/lib/auth/roles.ts` defines canonical role constants used by authorization utilities.

## Responsibilities

- Provide `UserRole` enum for app-level authorization logic.
- Map app-facing role keys to backend/API role names:
  - `AGENCY` → `admin`
  - `AGENT` → `agent`
  - `OWNER` → `owner`
  - `USER` → `registered_user`
- Expose default role fallback (`DEFAULT_AUTH_ROLE`).

## Exports

- `UserRole`
- `DEFAULT_AUTH_ROLE`

## Notes

- Keep enum values aligned with backend role names to avoid authorization mismatches.
