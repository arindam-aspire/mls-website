# Invite agent by email modal

**Source:** `src/features/user/modals/InviteAgentByEmailModal.tsx`

## Flow (multi-step screen transition)

1. **Input Step**: Enter agent email → click **Generate invitation** (`POST /agents/invite`).
2. **Generating Step**: The input form is hidden. A centered loader with a glowing pulse animation and status text is shown.
3. **Ready Step**: The form is replaced by a centered success screen featuring a green glowing success badge, the invitation ready details, and a `CopyLinkBar` to copy the generated link.

## Footer

- Initial State: **Cancel** (outline) | **Generate invitation** (solid, with icon)
- Generating State: Cancel disabled | **Generating…** (solid, loading state)
- Ready State: **Done** (outline, closes modal) | **Send via email** (solid, opens mailto app)

## Consumers

- `AgentsScreen` via `useInviteAgentByEmailModal`
