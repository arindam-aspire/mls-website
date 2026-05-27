# File Overview

API service functions calling HTTP clients.

**Source:** `src/features/auth/services/auth.service.ts`

# Responsibilities

- API service functions calling HTTP clients.

# Imports

- `import { authClient } from "@/src/apis/clients/api.client"`
- `import { authEndpoints } from "@/src/apis/endpoints/authEndpoints"`
- `import type { ConfirmSignUpRequest, ConfirmSignUpResponse, ForgotPasswordRequest, ForgotPasswordResponse, LoggedInUserResponse, LogoutResponse, SignInRequest, SignInResponse, SignInWithOtpRequest, SignInWithOtpResponse, SignInWithOtpVerifyRequest, SignInWithOtpVerifyResponse, SignUpRequest, SignUpResponse } from "../types/auth.types"`

# Exports

- `signInWithPassword`
- `getLoggedInUser`
- `logout`
- `signInWithOtpRequest`
- `signInWithOtpVerify`
- `signUp`
- `confirmSignUp`
- `forgotPassword`

# State Management

_No significant state; presentational or config module._

# API Usage

- Uses `authClient` / `apiClient` from `src/apis/clients/api.client.ts`.
- Endpoints: `authEndpoints`.
- Base URL: `API_BASE_URL` from `environment.config.ts`.

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

See source in `src/features/auth/services/auth.service.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/services/auth.service.ts` changes.
