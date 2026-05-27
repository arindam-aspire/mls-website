# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/index.tsx`

# Responsibilities

- Feature or shared UI component.

# Imports

_No notable imports._

# Exports

- `Avatar`
- `AVATAR_SIZES`
- `Button`
- `ToggleButton`
- `TOGGLE_BUTTON_COLORS`
- `TOGGLE_BUTTON_SIZES`
- `TOGGLE_BUTTON_VARIANTS`
- `IconButton`
- `ButtonGroup`
- `Card`
- `CardContent`
- `CardDescription`
- `CardFooter`
- `CardHeader`
- `CardTitle`
- `Modal`
- `ModalBackdrop`
- `ModalBackButton`
- `ModalCloseButton`
- `ModalContainer`
- `ModalContent`
- `ModalDescription`
- `ModalFooter`
- `ModalHeader`
- `ModalPanel`
- `ModalTitle`
- `MODAL_SIZES`
- `Popover`
- `PopoverBackdrop`
- `PopoverButton`

# State Management

_No significant state; presentational or config module._

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
- Uses **`Modal`** from UI kit (`rounded-xl`).

# Flow Description

See source in `src/components/ui/index.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/index.tsx` changes.
