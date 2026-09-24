# File Overview

Public frontend origin helpers for invitation emails and rewritten agency deep links.

**Source:** `src/configs/environment.config.ts`

# Responsibilities

- Export `API_BASE_URL` from `NEXT_PUBLIC_API_BASE_URL`.
- Export `GOOGLE_MAPS_API_KEY` from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (empty when unset). The create-property location map needs the Maps JavaScript API enabled on that key.
- Export `APP_URL` from `NEXT_PUBLIC_APP_URL` (empty when unset; trailing slashes stripped). Used as the public site origin in agency invitation emails.
- Export `getPublicAppOrigin()` — `APP_URL` when set, otherwise `window.location.origin` on the client. Does not hardcode localhost or production hosts.

# Imports

_No notable imports._

# Exports

- `getEnvironmentConfig`
- `API_BASE_URL`
- `GOOGLE_MAPS_API_KEY` (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, empty string when unset)
- `APP_URL` (`NEXT_PUBLIC_APP_URL`, empty string when unset)
- `getPublicAppOrigin`

# State Management

_N/A — no local/global state in this module._

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

See source in `src/configs/environment.config.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

Set `NEXT_PUBLIC_APP_URL` per environment (dev / staging / production) to the public website origin, for example the deployed MLS host. Invitation emails use this value as `frontend_url` on `POST /agency/invitations`.

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/configs/environment.config.ts` changes.
- Do not put localhost or a production hostname in source as a default `APP_URL`.
