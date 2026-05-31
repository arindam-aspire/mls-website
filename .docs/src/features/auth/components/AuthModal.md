# File Overview

Auth modal shell: reads `useAuthStore`, renders the active screen from `screenStack`, closes via `closeAuth`.

**Source:** `src/features/auth/components/AuthModal.tsx` (Client Component)

# Responsibilities

- Subscribe to `isOpen` and `screenStack` from Zustand.
- Map top-of-stack `AuthView` to screen component via `renderAuthView`.
- Re-hydrate modal state from `sessionStorage` on mount (page refresh mid-flow).
- Wire `Modal` `onClose` to `closeAuth()`.

# Imports

- UI: `Modal`, `ModalBackdrop`, `ModalContainer`
- `AUTH_VIEW`, `AuthView` from `../authViews`
- `readAuthModalSession` from `../store/authModalStorage`
- `useAuthStore` from `../store/auth.store`
- All auth screen components under `../screens/`

# Exports

- `AuthModal`
- Re-exports: `AUTH_VIEW`, `AuthView`, resolver helpers from `authViews.ts`

# State Management

- **Zustand** `useAuthStore` — `isOpen`, `screenStack`, `closeAuth`
- Mount `useEffect` merges persisted session if `isOpen`

# API Usage

_N/A — presentation shell._

# Navigation

No router usage. Screen hooks inside child screens call `push` / `pop` / `closeAuth`.

# Props / Parameters

No props — global modal mounted in layouts.

# Actions / Inputs

## User actions

- Close modal (backdrop, escape) → `closeAuth()`
- Back navigation handled inside screens via `AuthModalHeader` + hook `onBack`

# UI Details

- **Theme:** semantic tokens via child screens.
- Uses **`Modal`** from UI kit (`rounded-xl`).
- **Responsive:** child screens handle layout.

# Flow Description

1. Layout renders `<AuthModal />` always (returns `null` when closed).
2. `activeScreen = screenStack[screenStack.length - 1]`.
3. `renderAuthView(activeScreen)` returns screen JSX.
4. On mount, if sessionStorage has `isOpen: true`, `setState` restores stack and transient data.

# Dependencies

- `PublicLayout`, `LandingLayout`
- All screens under `screens/`
- `auth.store.ts`, `authModalStorage.ts`

# Notes

- Does not render `AuthModalHeader` itself — each screen includes header via its hook.
- No `useSearchParams` or URL query manipulation.
