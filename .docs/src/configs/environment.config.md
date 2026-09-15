# File Overview

Project source module.

**Source:** `src/configs/environment.config.ts`

# Responsibilities

- Project source module.
- Export `API_BASE_URL` from `NEXT_PUBLIC_API_BASE_URL`.
- Export `GOOGLE_MAPS_API_KEY` from `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (empty when unset). The create-property location map needs the Maps JavaScript API enabled on that key.

# Imports

_No notable imports._

# Exports

- `getEnvironmentConfig`
- `API_BASE_URL`
- `GOOGLE_MAPS_API_KEY` (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, empty string when unset)

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

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/configs/environment.config.ts` changes.
