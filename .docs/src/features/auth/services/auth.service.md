# File Overview

API service functions calling HTTP clients.

**Source:** `src/features/auth/services/auth.service.ts`

# Responsibilities

- API service functions calling HTTP clients.

# Imports

- `import { authClient } from "@/src/apis/clients/api.client"`
- `import { authEndpoints } from "@/src/apis/endpoints/authEndpoints"`
- `import { withDisplayableProfilePicture } from "../utils/normalizeLoggedInUser"`
- `import type { ConfirmSignUpRequest, ConfirmSignUpResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoggedInUserResponse, LogoutResponse, SignInRequest, SignInResponse, SignInWithOtpRequest, SignInWithOtpResponse, SignInWithOtpVerifyRequest, SignInWithOtpVerifyResponse, SignUpRequest, SignUpResponse } from "../types/auth.types"`

# Exports

- `signInWithPassword`
- `getLoggedInUser`
- `logout`
- `signInWithOtpRequest`
- `signInWithOtpVerify`
- `signUp`
- `agencySignUp`
- `confirmSignUp`
- `forgotPassword`
- `resetPassword`
- `changePassword`

# State Management

_No significant state; presentational or config module._

# API Usage

- Uses `authClient` / `apiClient` from `src/apis/clients/api.client.ts`.
- Endpoints: `authEndpoints`.
- Base URL: `API_BASE_URL` from `environment.config.ts`.
- `changePassword` sends authenticated `POST /auth/change-password` with `{ password, previous_password }`.

# Navigation

_No direct navigation._

# Props / Parameters

_N/A — non-component module._

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

_No explicit actions detected._

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

_N/A._

# Flow Description

`getLoggedInUser` calls `GET /auth/me`, then `withDisplayableProfilePicture` so `profile_picture_url` is a loadable HTTP(S) or same-browser `blob:` URL. Sign-in and `AuthProvider` use this before `setUser`.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.
- [normalizeLoggedInUser.md](../utils/normalizeLoggedInUser.md)
- [profilePictureCache.md](../../../lib/profilePictureCache.md)

# Notes

- Keep in sync when `src/features/auth/services/auth.service.ts` changes.
