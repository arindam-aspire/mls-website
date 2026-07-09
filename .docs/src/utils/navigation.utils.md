# File Overview

Project source module.

**Source:** `src/utils/navigation.utils.ts`

# Responsibilities

- Hold a module-level reference to the Next.js `AppRouterInstance` (set by `NavigationInitializer`).
- **`navigateTo`**, **`navigateReplace`**, **`navigateBack`** — run [navigationGuard.md](../navigation/navigationGuard.md) interceptors before imperative navigation (e.g. logout redirect).

# Imports

_No notable imports._

# Exports

- `initializeNavigation`
- `navigateTo`
- `navigateReplace`
- `navigateBack`

# State Management

_No significant state; presentational or config module._

# API Usage

_N/A unless extended._

# Navigation

- Imperative **`navigateTo`** from `navigation.utils` (non-locale paths; used after logout).

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

See source in `src/utils/navigation.utils.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/utils/navigation.utils.ts` changes.
