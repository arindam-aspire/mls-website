# Protected Layout (`src/layouts/protected-layout/`)

## Purpose

Placeholder folder for authenticated-only route chrome and wrappers that may be introduced later (for example, account area sidebars, protected page headers, or dashboard-specific shells).

## Current Status

- Placeholder components are now scaffolded.
- Wired to App Router `(main)` route group (`app/[locale]/(main)/layout.tsx`).
- Intended as a starting point for authenticated shell UX.

## Structure

```text
ProtectedLayout (index.tsx)
├── ProtectedHeader
├── ProtectedSidebar
├── ProtectedDrawer
├── ProtectedMobileMenu
├── ProtectedMain (children)
└── ProtectedFooter
```

## Files

| File | Role |
| --- | --- |
| [index.md](./index.md) | Protected layout composer |
| [ProtectedHeader.md](./ProtectedHeader.md) | Sticky protected header placeholder |
| [ProtectedSidebar.md](./ProtectedSidebar.md) | Desktop sidebar placeholder |
| [ProtectedDrawer.md](./ProtectedDrawer.md) | Large-screen drawer placeholder |
| [ProtectedMobileMenu.md](./ProtectedMobileMenu.md) | Mobile menu strip placeholder |
| [ProtectedMain.md](./ProtectedMain.md) | Main content wrapper for route children |
| [ProtectedFooter.md](./ProtectedFooter.md) | Footer placeholder |

## Planned Conventions

- Add `PascalCase` component files as protected layout pieces are implemented.
- Keep layout logic presentational in components and move business/state logic into feature hooks.
- Use semantic theme tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`) to support both light and dark modes.
- Keep responsive behavior mobile-first and maintain `rounded-xl` for layout containers and `rounded-lg` for controls.

## Dependencies

- Parent index: `.docs/src/layouts/README.md`
- Sibling layout modules:
  - `src/layouts/public-layout/`
  - `src/layouts/landing-layout/`
