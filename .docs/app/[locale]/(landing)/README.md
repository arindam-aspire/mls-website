# Route group `(landing)` — `app/[locale]/(landing)/`

Landing routes using the dedicated `LandingLayout`. Group name does **not** appear in the URL.

## Layout

[layout.md](./layout.md) → `LandingLayout`.

## Pages

| File | URL | Screen |
| --- | --- | --- |
| [page.md](./page.md) | `/en/` | `LandingScreen` |
| [agency-invitation/page.md](./agency-invitation/page.md) | `/en/agency-invitation?token=` | `AgencyInvitationScreen` |
| `agency-password-setup/page.tsx` | `/en/agency-password-setup?token=` | `AgencyPasswordSetupScreen` |
| `agent-invite/page.tsx` | `/en/agent-invite?token=` | `AgentInviteScreen` |
| `agent-password-setup/page.tsx` | `/en/agent-password-setup?token=` | `AgentPasswordSetupScreen` |

## Architecture

```text
/en
  layout.tsx (LandingLayout)
  page.tsx → landing
```

## Related

- [main route group](../(main)/README.md)
- [property route group](../(property)/README.md)
- [locale layout](../layout.md)
