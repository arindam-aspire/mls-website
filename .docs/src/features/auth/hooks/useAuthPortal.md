# File Overview

Reads agent portal flag from Zustand for agency sign-in modal flows. Also exports modal back-navigation helper.

**Source:** `src/features/auth/hooks/useAuthPortal.ts` (Client hook)

# Exports

- `useAuthPortal()` — returns `"agent" | null` when `agentPortal` is true in store
- `useIsAgentSignInPortal()` — boolean alias for agent portal UI
- `useAuthModalNavigation()` — `{ canGoBack, onBack }` derived from `screenStack.length`

# State Management

- **Zustand** `useAuthStore.agentPortal` — set via `setAgentPortal(true)` when user picks Agent on account chooser

# Navigation

- Set in `useAccountChooseScreen` when type is `agent`: `setAgentPortal(true)` before `push(agencySignIn)`.
- No URL `portal` query param.

# Dependencies

- [auth.store.md](../store/auth.store.md)
- Agency sign-in / email sign-in screens and hooks

# Notes

- `useAuthModalNavigation().onBack` is `pop` when stack length > 1; screens pass to `AuthModalHeader`.
