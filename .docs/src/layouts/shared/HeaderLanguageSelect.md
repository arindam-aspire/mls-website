# File Overview

Shared desktop language picker for all header layouts: circular flag + uppercase locale code trigger; popover list with flag and native language name per option.

**Source:** `src/layouts/shared/HeaderLanguageSelect.tsx` (Client Component)

Used by:

- `ProtectedHeader` (via `ProtectedLanguageSelect` re-export)
- `DesktopActions` (public layout)
- `LandingDesktopActions` (landing layout, with optional `overHero` styling)

Mobile drawers still use `SelectDropdown` in layout-specific mobile menus.

# Responsibilities

- Render flag + code trigger (`EN`, `AR`, etc.) for the active locale.
- Open a `Popover` menu listing all `AppLocale` options with flag icons and translated labels.
- Call `onChange` and close the popover when the user picks a locale.
- Apply `overHero` light-on-image trigger styling when used on the landing header.

# Imports

- `@/src/components/ui/popover` (`Popover`, `PopoverButton`, `PopoverPanel`)
- `@headlessui/react` `useClose`
- `@/src/i18n/localeFlags` (`localeDisplayCode`, `localeFlagUrl`)
- `./buildHeaderLocaleOptions` (`HeaderLanguageOption`)

# Exports

- `HeaderLanguageSelect`
- `HeaderLanguageSelectProps`

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `value` | `AppLocale` | Active locale |
| `options` | `HeaderLanguageOption[]` | `{ value, label }` from `buildHeaderLocaleOptions` |
| `onChange` | `(locale: AppLocale) => void` | Locale switch handler |
| `ariaLabel` | `string` | Accessible name (`common.language`) |
| `className` | `string` | Optional wrapper classes |
| `overHero` | `boolean` | Landing header: white trigger text and hover on hero |

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Click trigger | Opens language popover (`anchor="bottom end"`) |
| Click menu item | `onChange(option.value)` then closes popover |
| Keyboard | Headless UI popover focus management |

# UI Details

- Trigger: circular flag (`size-5`) + uppercase locale code (`controlTextClasses.sm`); transparent borderless button with hover `bg-inherit-color/10` (or `bg-white/10` when `overHero`).
- Menu panel: `rounded-xl` via shared `PopoverPanel`, `min-w-52`, items `rounded-lg` with flag (`size-6`) + label.
- Selected row: `bg-primary-light/60` (light) / `bg-primary/15` (dark).
- Flags loaded from `localeFlagUrl` (native `<img>`).
- Light/dark semantic tokens; RTL-safe `text-start` and `gap-*` layout.

# Flow Description

1. Parent builds options via `buildHeaderLocaleOptions(t)` from `common.localeNames.*`.
2. User opens popover from header toolbar.
3. User selects a language → parent runs `router.replace(pathname, { locale })`.

# Dependencies

- [buildHeaderLocaleOptions.md](./buildHeaderLocaleOptions.md)
- [../../i18n/localeFlags.md](../../i18n/localeFlags.md)
- [../protected-layout/ProtectedLanguageSelect.md](../protected-layout/ProtectedLanguageSelect.md) (re-export alias)

# Notes

- Supports `en`, `ar`, `es`, `fr` only (app routing locales).
- Loading skeletons in desktop action bars use a compact `w-14` block approximating flag + code width.
