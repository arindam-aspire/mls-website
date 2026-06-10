# UI kit (`src/components/ui/`)

Headless UI–based design system for MLS. Exported from [index.md](./index.md).

## Components

| Module | Exports |
| --- | --- |
| [avatar/](./avatar/index.md) | `Avatar` |
| [button/](./button/index.md) | `Button` |
| [button-group/](./button-group/index.md) | `ButtonGroup` |
| [breadcrumb/](./breadcrumb/index.md) | `Breadcrumb` |
| [budget-select/](./budget-select/index.md) | `BudgetSelect`, Buy/Rent range presets |
| [card/](./card/index.md) | `Card`, `CardHeader`, … |
| [checkbox/](./checkbox/index.md) | `Checkbox`, `CheckboxField` |
| [icon-button/](./icon-button/index.md) | `IconButton` |
| [toggle-button/](./toggle-button/index.md) | `ToggleButton` |
| [otp-verification/](./otp-verification/README.md) | `OtpVerificationForm`, `OtpVerificationTitle`, label hooks |
| [modal/](./modal/index.md) | `Modal`, `ModalPanel`, … |
| [popover/](./popover/index.md) | `Popover`, `PopoverButton`, `PopoverPanel` |
| [link/](./link/index.md) | `Link` (styled button) |
| [input/](./input/index.md) | `Input` |
| [textarea/](./textarea/index.md) | `Textarea` |
| [phone-input/](./phone-input/index.md) | `PhoneInput`, countries data |
| [select/](./select/index.md) | `Select` |
| [select-dropdown/](./select-dropdown/index.md) | `SelectDropdown` |
| [skeleton/](./skeleton/index.md) | `Skeleton`, `SkeletonText` |
| [switch/](./switch/index.md) | `Switch`, `SettingField`, `SwitchField` |
| [toaster/](./toaster/index.md) | `Toaster`, toast icons |

## Shared styles

- [fieldVariants.md](./fieldVariants.md) — shared input/field class variants.
- [responsiveSizes.md](./responsiveSizes.md) — mobile-first moderate sizing (`sm:` full scale, `lg:` roomier).

## Types

Each component folder may include `types.ts` — documented as `types.md` alongside `index.md`.

## Styling rules

- Colors: `bg-primary`, `text-text`, `border-secondary/15`, etc.
- Radius: `rounded-lg` (controls), `rounded-xl` (modal/popover panels), `rounded-full` (avatars).
- On `bg-primary` buttons: `text-white`.

## Usage

```tsx
import { Button, Modal, Input } from "@/src/components/ui";
```
