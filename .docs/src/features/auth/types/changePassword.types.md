# File Overview

Type definitions for authenticated change-password API payload and response.

**Source:** `src/features/auth/types/changePassword.types.ts`

# Responsibilities

- Defines request shape for `/auth/change-password`.
- Defines response wrapper shape for change-password mutation handling.

# Exports

- `ChangePasswordRequest`
- `ChangePasswordResponse`

# API Usage

- Used by `src/features/auth/services/auth.service.ts` in `changePassword`.
- Request body fields:
  - `password`
  - `previous_password`

# Notes

- Response follows the project API wrapper pattern: `{ success, message, data, error, meta }`.
