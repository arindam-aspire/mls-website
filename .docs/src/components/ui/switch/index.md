# File Overview

Boolean on/off control built on Headless UI `Switch`, plus shared settings-row layouts: `SettingField` (generic trailing control) and `SwitchField` (switch on the right).

**Source:** `src/components/ui/switch/index.tsx` (Client Component)

# Responsibilities

- Render an accessible pill switch (track + sliding thumb).
- `SettingField` — icon, title, optional subtitle, and any trailing control (used for language `ToggleButton`).
- `SwitchField` — `SettingField` with a built-in `Switch`.
- Support controlled `checked` / `onChange(boolean)` usage on `Switch`.

# Imports

- `@headlessui/react` — `Switch`
- `@/src/lib/cn`

# Exports

- `Switch`
- `SettingField`
- `SwitchField`
- `SWITCH_COLORS`, `SWITCH_SIZES`
- Types: `SwitchColor`, `SwitchFieldProps`, `SwitchProps`, `SwitchSize`

# State Management

- Controlled via parent (`checked`, `onChange`); optional `defaultChecked` for uncontrolled `Switch`.

# API Usage

_N/A._

# Navigation

_No direct navigation._

# Props / Parameters

## `Switch`

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `checked` | `boolean` | — | Controlled on state |
| `defaultChecked` | `boolean` | — | Initial state (uncontrolled) |
| `onChange` | `(checked: boolean) => void` | — | Toggle handler |
| `disabled` | `boolean` | `false` | Disables interaction |
| `color` | `"primary"` \| `"secondary"` | `"primary"` | Track color when on |
| `size` | `"sm"` \| `"md"` | `"sm"` | Track/thumb dimensions |
| `aria-label` | `string` | — | Accessible name when no visible label |

## `SettingField`

| Prop | Type | Purpose |
| --- | --- | --- |
| `icon` | `ReactNode` | Optional leading icon in surface box |
| `title` | `ReactNode` | Primary label |
| `description` | `ReactNode` | Subtitle |
| `children` | `ReactNode` | Trailing control (`ToggleButton`, etc.) |

## `SwitchField`

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Primary label (e.g. “Dark Mode”) |
| `description` | `ReactNode` | — | Subtitle (e.g. “Switch to dark theme”) |
| `icon` | `ReactNode` | — | Optional leading icon in `bg-surface` rounded box (matches drawer language row) |
| `iconClassName` | `string` | — | Override icon container classes |
| `checked` | `boolean` | — | Switch state |
| `onChange` | `(checked: boolean) => void` | — | Toggle handler |
| `color` / `size` | same as `Switch` | `"primary"` / `"sm"` | Passed to inner `Switch` |

# Actions / Inputs

## Inputs

- Single boolean switch (on/off).

## Actions

- Click or keyboard toggle on the switch control.

## Validations

_None._

## Show/Hide Controls

- Description paragraph omitted when `description` is null or empty.

# UI Details

- **Track:** `rounded-full`, `bg-secondary/25` (light) / `dark:bg-secondary/35`; when on, `data-checked:bg-primary` (or `secondary`).
- **Thumb:** white circle, `group-data-checked:translate-x-5` slide animation.
- **SwitchField row:** optional leading icon (`size-10`, `rounded-lg`, `bg-surface`); title `text-sm font-semibold text-text`; description `text-sm text-muted`; switch aligned to the right.
- **Focus:** `focus-visible:ring-2` with semantic ring offset on `bg-page`.
- **Radius:** pill switch uses `rounded-full` (control pattern, not card/modal `rounded-xl`).

# Flow Description

1. Parent passes `checked` and `onChange`.
2. User activates the Headless UI switch; `onChange(true | false)` fires.
3. In mobile menus, `MenuThemeRow` maps `checked === (theme === "dark")` and sets theme to `"dark"` or `"light"` via `ThemeProvider`.

# Dependencies

- [PublicMobileMenu.md](../../../layouts/public-layout/PublicMobileMenu.md), [LandingMobileMenu.md](../../../layouts/landing-layout/LandingMobileMenu.md) — `MenuLanguageRow` uses `SettingField`; `MenuThemeRow` uses `SwitchField`.
- Re-exported from `src/components/ui/index.tsx`.

# Notes

- Prefer `SwitchField` for boolean settings; use `SettingField` when the trailing control is not a switch (e.g. locale `SelectDropdown` in mobile drawers).
