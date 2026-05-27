# Components (`src/components/`)

Shared UI outside feature folders.

## Structure

| Folder | Purpose | README |
| --- | --- | --- |
| `ui/` | Design system (buttons, inputs, modal, …) | [ui/README.md](./ui/README.md) |
| `common/` | App-wide composites (coming soon, confirm dialog) | [common/README.md](./common/README.md) |

## Conventions

- Import from `@/src/components/ui` barrel where possible.
- Semantic theme tokens; `rounded-lg` controls; `rounded-xl` surfaces.
- Client components marked `"use client"` when using hooks or Headless UI.

## vs feature components

Feature-specific UI lives under `src/features/<name>/components/`. Only promote to `common/` when used across multiple features.
