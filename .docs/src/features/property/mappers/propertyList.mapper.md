# File Overview

Placeholder mapper for the property list flow. Maps API/list payloads to view models used by `PropertyListScreen`.

**Source:** `src/features/property/mappers/propertyList.mapper.ts`

# Responsibilities

- _(Not implemented yet.)_ Transform `PropertyListResponse` / API items into list card or row view models.

# Imports

_None yet._

# Exports

_None yet._

# State Management

_N/A — pure mapping functions only._

# API Usage

_N/A._

# Navigation

_N/A._

# Props / Parameters

_N/A until functions are added._

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. Service or mutation returns list API data.
2. Screen (or hook) calls mapper functions before render.
3. UI binds to mapped view models.

# Dependencies

- [../types/property.types.md](../types/property.types.md)
- [../screens/PropertyListScreen.md](../screens/PropertyListScreen.md)
- [../services/property.service.md](../services/property.service.md)

# Notes

File is intentionally blank pending list UI implementation.
