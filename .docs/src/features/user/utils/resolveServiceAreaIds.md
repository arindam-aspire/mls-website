# `resolveServiceAreaIds`

**Source:** `src/features/user/utils/resolveServiceAreaIds.ts`

# File Overview

Maps selected service-area option values to numeric taxonomy IDs for `POST /agents/onboarding` (`service_area_ids`).

# Responsibilities

- Look up each selected `city|area` option in `buildLocationSuggestions`.
- Prefer `areaId`, else `cityId`.

# Imports

- `buildLocationSuggestions`
- `LocationTaxonomyResponse`

# Exports

- `resolveServiceAreaIds(values, taxonomy)`

# State Management

None.

# API Usage

None.

# Navigation

None.

# Props / Parameters

| Argument | Notes |
| --- | --- |
| `values` | Selected option values from the onboarding form |
| `taxonomy` | Location taxonomy payload |

# Actions / Inputs

N/A.

# UI Details

N/A.

# Flow Description

Used by `useAgentOnboardingForm.buildSubmitPayload`.

# Dependencies

- `useAgentOnboardingForm`

# Notes

The joined label string is still sent as `service_area`.
