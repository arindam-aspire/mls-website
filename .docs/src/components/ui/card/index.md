# File Overview

Feature or shared UI component.

**Source:** `src/components/ui/card/index.tsx`

# Responsibilities

- Feature or shared UI component.

# Imports

- `import { cn } from "@/src/lib/cn"`

# Exports

- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

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

- **`Card` shell:** `rounded-lg`, `bg-surface`, `text-text`, `border-none`, shadow `0 0.25rem 1.875rem rgba(46, 45, 116, 0.05)` (Tailwind `shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]`).
- **`CardFooter`:** top divider `border-t border-secondary/30` (internal separator only).
- **Theme:** semantic surface/text tokens; light/dark via `ThemeProvider`.
- **Radius:** `rounded-lg` on `Card`; consumers may override (e.g. `rounded-xl` on profile cards).
- **Responsive:** `CardHeader` / `CardContent` / `CardFooter` use `p-4` / `md:p-6` padding steps.

# Flow Description

See source in `src/components/ui/card/index.tsx` for step-by-step behavior aligned with [application.md](../../application.md) (path relative may vary).

# Dependencies

- Parent feature or route that imports this file.
- See **Imports** for direct module dependencies.

# Notes

- Keep in sync when `src/components/ui/card/index.tsx` changes.
