# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/phone-input/index.tsx` (Client Component)

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { cn } from "@/src/lib/cn"`
- `import { isRtlLocale } from "@/src/i18n/routing"`
- `import { Popover, PopoverButton, PopoverPanel } from "../popover"`
- `import type { PhoneInputProps } from "./types"`

# Exports

- `PhoneInput`
- `countryFlagUrl`
- `DEFAULT_PHONE_INPUT_COUNTRY_CODE`
- `getPhoneInputCountryByCode`
- `PHONE_INPUT_COUNTRIES`
- `type PhoneInputCountry`

# State Management

- **React** `useState`

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

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

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).

# Flow Description

See source in `src/components/ui/phone-input/index.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/phone-input/index.tsx` changes.
