# File Overview

Reusable filter panel for the property list screen.

**Source:** `src/features/property/components/PropertyListFilters.tsx`

# Responsibilities

- Render status/category/sort controls.
- Provide grid/list layout toggle buttons.
- Expose apply/reset actions to parent screens.

# Imports

- `Button` from `src/components/ui/button`
- `SelectDropdown` from `src/components/ui/select-dropdown`

# Exports

- `PropertyLayoutVariant`
- `PropertyListFilters`

# State Management

- Stateless UI component; all values and actions are controlled via props.

# API Usage

_No direct API calls._

# Navigation

_No direct navigation._

# Props / Parameters

- `status`, `category`, `sortBy`, `layoutVariant`
- Dropdown option arrays for each filter field
- Change handlers for each field and layout variant
- Optional `onApplyFilters` / `onResetFilters` actions

# Actions / Inputs

## Inputs

- Status dropdown
- Category dropdown
- Sort dropdown

## Actions

- Toggle list layout variant (`grid`/`list`)
- Trigger reset callback
- Trigger apply callback

# UI Details

- Uses semantic tokens (`bg-surface`, `text-text`, `border-secondary/15`).
- Outer filter container uses `rounded-xl` as card surface.
- Controls remain responsive with mobile-first grid (`1 → 2 → 5` columns).

# Flow Description

1. Parent passes current filter values and options.
2. User changes a field; component emits the corresponding callback.
3. User toggles layout or clicks apply/reset; parent decides what to do.

# Dependencies

- Intended for `PropertyListScreen` and related property list routes.

# Notes

- Keep labels/options localized at parent level if i18n text is required.
