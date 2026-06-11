# File Overview

API path constants.

**Source:** `src/apis/endpoints/propertyEndpoints.ts`

# Responsibilities

- API path constants.

# Imports

_No notable imports._

# Exports

- `propertyEndpoints`

# State Management

_N/A — no local/global state in this module._

# API Usage

| Constant | Path |
| --- | --- |
| `PROPERTY_LIST` | `/properties` |
| `PROPERTY_DETAILS` | `/properties/:id` |
| `PROPERTY_SIMILAR` | `/properties/:id/similar` |
| `FEATURE_CATALOG` | `/features?is_active=true` |
| `AGENT_PROPERTIES` | `/agent-properties?page=&pageSize=` |
| `AGENT_PROPERTY_DRAFTS` | `/agent-properties/drafts?page=&pageSize=` |
| `PROPERTY_SUBMISSIONS` | `/property-submissions` |
| `PROPERTY_SUBMISSION_BY_ID` | `/property-submissions/:submissionId` |

Consumed by [property.service.ts](../../features/property/services/property.service.ts); types in `src/features/property/types/property.types.ts`.

# Navigation

_N/A._

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

See source in `src/apis/endpoints/propertyEndpoints.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/apis/endpoints/propertyEndpoints.ts` changes.
