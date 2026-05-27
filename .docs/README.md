# MLS Website — Documentation index

This directory is the **single source of truth** for application flow, module behavior, and file-level implementation details.

## Top-level references

| Document | Purpose |
| --- | --- |
| [application.md](./application.md) | Whole-app architecture, routes, auth, APIs |
| [folder-structure.md](./folder-structure.md) | Repository tree diagram |
| [packages.md](./packages.md) | npm dependencies |

## Mirrored documentation

Paths under `.docs/` mirror `src/` and `app/`:

```
src/features/auth/components/SignInForm.tsx
  → .docs/src/features/auth/components/SignInForm.md
```

Each major folder has a **README.md** describing architecture and flows. Each source file has a matching **`.md`** with overview, responsibilities, state, API, navigation, UI, and flow sections.

## Entry points

| Area | README |
| --- | --- |
| App Router | [app/README.md](./app/README.md) |
| Source root | [src/README.md](./src/README.md) |
| Features | [src/features/README.md](./src/features/README.md) |
| Auth | [src/features/auth/README.md](./src/features/auth/README.md) |
| UI components | [src/components/ui/README.md](./src/components/ui/README.md) |
| APIs | [src/apis/README.md](./src/apis/README.md) |
| Layouts | [src/layouts/README.md](./src/layouts/README.md) |
| Providers | [src/providers/README.md](./src/providers/README.md) |

## Regenerating scaffolding

After adding many source files at once, run:

```bash
node scripts/bootstrap-docs.mjs
```

This refreshes auto-generated sections from source (imports/exports). **Always review and enrich** critical files (auth, layouts, routes) by hand—especially flows that changed recently.

## Maintenance

When changing code under `src/` or `app/`, update mirrored docs in the **same session** (see `.cursor/rules/docs-sync.mdc`).
