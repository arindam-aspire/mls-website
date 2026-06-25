# Agents page

**Source:** `app/[locale]/(main)/agents/page.tsx`

Admin-only route for the Agents management screen.

## Navigation

- Locale-prefixed URL: `/en/agents`, `/ar/agents`, etc.
- Sidebar: **User Management → Agents** (`AGENTS` permission)
- Protected mobile drawer: **User Management → Agents** (admin only; not in profile popover or My Activity)

## Auth

- `useAuthorize("AGENTS")` — allowed role: `admin` (`UserRole.AGENCY`)
- Middleware: `/agents` is in `PROTECTED_ROUTES` (requires `access_token` cookie)

## Screen

Renders [AgentsScreen.md](../../../src/features/user/screens/AgentsScreen.md).
