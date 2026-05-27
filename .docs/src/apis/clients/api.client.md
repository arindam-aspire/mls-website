# File Overview

HTTP client wrappers.

**Source:** `src/apis/clients/api.client.ts`

# Responsibilities

- HTTP client wrappers.

# Imports

- `import { createAxiosInstance } from "@/src/apis/core/axios.factory"`
- `import { applyInterceptors } from "@/src/apis/core/axios.interceptor"`
- `import { normalizeAxiosError } from "@/src/apis/core/error.normalizer"`

# Exports

- `authClient`
- `apiClient`
- `BaseApiClient`
- `ApiRequestConfig`
- `ApiClientRequestConfig`

# State Management

_No significant state; presentational or config module._

# API Usage

- Uses `authClient` / `apiClient` from `src/apis/clients/api.client.ts`.
- Endpoints: see service imports.
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

See source in `src/apis/clients/api.client.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/apis/clients/api.client.ts` changes.
