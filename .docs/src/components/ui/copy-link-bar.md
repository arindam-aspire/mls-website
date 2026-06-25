# `CopyLinkBar`

**Source:** `src/components/ui/copy-link-bar/index.tsx`

Read-only URL display with an inline **Copy link** action on the right, matching invite-link UX patterns.

## Props

| Prop | Description |
| --- | --- |
| `value` | URL or text to display (truncated) |
| `copyLabel` | Label for the copy action (e.g. `user.agents.inviteByEmailModal.success.copyLink`) |
| `onCopy` | Called when the user taps copy |
| `label` | Optional field label above the bar |

## UI Details

- `rounded-lg` bordered bar (`inheritOutlineVariantClasses`), link text left, primary copy control right.
- `Copy` icon + label; supports light/dark via semantic tokens.

## Consumers

- `InviteAgentByEmailContent`
