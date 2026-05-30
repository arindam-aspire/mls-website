# UI kit (`src/components/ui/`)

Headless UI–based design system for MLS. Exported from [index.md](./index.md).

## Components

| Module | Exports |
| --- | --- |
| [avatar/](./avatar/index.md) | `Avatar` |
| [button/](./button/index.md) | `Button` |
| [button-group/](./button-group/index.md) | `ButtonGroup` |
| [budget-select/](./budget-select/index.md) | `BudgetSelect`, Buy/Rent range presets |
| [card/](./card/index.md) | `Card`, `CardHeader`, … |
| [icon-button/](./icon-button/index.md) | `IconButton` |
| [toggle-button/](./toggle-button/index.md) | `ToggleButton` |
| [modal/](./modal/index.md) | `Modal`, `ModalPanel`, … |
| [popover/](./popover/index.md) | `Popover`, `PopoverButton`, `PopoverPanel` |
| [link/](./link/index.md) | `Link` (styled button) |
| [input/](./input/index.md) | `Input` |
| [textarea/](./textarea/index.md) | `Textarea` |
| [phone-input/](./phone-input/index.md) | `PhoneInput`, countries data |
| [select/](./select/index.md) | `Select` |
| [select-dropdown/](./select-dropdown/index.md) | `SelectDropdown` |
| [skeleton/](./skeleton/index.md) | `Skeleton`, `SkeletonText` |
| [toaster/](./toaster/index.md) | `Toaster`, toast icons |

## Shared styles

- [fieldVariants.md](./fieldVariants.md) — shared input/field class variants.
- [responsiveSizes.md](./responsiveSizes.md) — mobile-first compact sizing (`sm:` restores full scale) for controls.

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
