# File Overview

Axios infrastructure (tokens, interceptors, errors).

**Source:** `src/apis/core/error.normalizer.ts`

# Responsibilities

- Axios infrastructure (tokens, interceptors, errors).

# Imports

_No notable imports._

# Exports

- `normalizeAxiosError`
- `isApiError`
- `NormalizedApiErrorCode`
- `ApiError`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

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

`normalizeAxiosError` maps Axios failures to `ApiError`.

Response message extraction (`extractResponseMessage`) reads, in order:

1. Top-level `message` (string)
2. Top-level `detail` (string)
3. FastAPI `detail.message` when `detail` is an object (`{ code, message }`)
4. First entry in `errors[]`

For 4xx conflicts (e.g. 409), this yields the backend text such as `"An account with this email already exists"` instead of Axios’s `"Request failed with status code 409"`.

See source in `src/apis/core/error.normalizer.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/apis/core/error.normalizer.ts` changes.
