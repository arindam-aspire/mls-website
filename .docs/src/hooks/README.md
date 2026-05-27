# Hooks (`src/hooks/`)

Shared React hooks.

| File | Export | Purpose |
| --- | --- | --- |
| [useForm.md](./useForm.md) | `useForm` | Controlled form state, validate on blur/submit |
| [useToast.md](./useToast.md) | `useToast`, `ToastProvider` | Toast queue + `success` / `error` / `promise` helpers |

## Providers

`useToast` requires `ToastProvider` from `useToast.tsx`, wrapped by app-level `src/providers/ToastProvider.tsx` which also renders `<Toaster />`.

## Conventions

- File names: `use*.ts` / `use*.tsx`
- Client-only (`"use client"`)
