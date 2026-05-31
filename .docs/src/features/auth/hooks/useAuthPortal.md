# File Overview

Reads `portal` query param (`agency` | `agent`) for agency sign-in modal flows.

**Source:** `src/features/auth/hooks/useAuthPortal.ts` (Client hook)

# Exports

- `useAuthPortal()` — returns `AuthPortalContext | null`
- `useIsAgentSignInPortal()` — `true` when `portal=agent`

# Navigation

- Set via `buildAuthModalUrl(..., { portal: "agent" })` when choosing Agent on account chooser Sign In.
- Preserved across agency sign-in, email sign-in, OTP, and forgot-password sub-flows.

# Dependencies

- [authViews.md](../authViews.md)
