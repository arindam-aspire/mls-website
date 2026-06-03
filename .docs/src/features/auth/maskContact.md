# File Overview

Project source module.

**Source:** `src/features/auth/maskContact.ts`

# Responsibilities

- Project source module.

# Imports

- `import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries"`

# Exports

- `maskEmail(email, options?)` — masks local part as `{visible}***{@domain}`; `visibleLocalChars` defaults to `1` (OTP), profile uses `2`.
- `maskPhone(nationalNumber, countryCode?)` — e.g. `+962 7***4567`.
- `maskStoredPhoneNumber(phoneNumber, defaultCountryCode?)` — parses dial code from stored value then masks (profile).

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

See source in `src/features/auth/maskContact.ts` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/features/auth/maskContact.ts` changes.
