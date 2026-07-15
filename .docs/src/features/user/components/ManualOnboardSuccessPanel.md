# `ManualOnboardSuccessPanel`

**Source:** `src/features/user/components/ManualOnboardSuccessPanel.tsx`

Success card shown inside `ManualOnboardAgentContent` after a successful manual agent onboard.

## Responsibilities

- Show ready title + success message
- Show temporary password `CopyLinkBar` only when `temporaryPassword` is non-empty (trimmed)
- Show password setup link `CopyLinkBar` when `setupLink` is truthy
- Show password hint below the copy bars

## Props

| Prop | Role |
| --- | --- |
| `temporaryPassword` | Value for password bar; blank/whitespace skips rendering |
| `setupLink` | Optional setup URL; omitted bar when falsy |
| `onCopyPassword` / `onCopySetupLink` | Clipboard handlers from `useManualOnboardAgentModal` |

## UI Details

- Outer shell: `rounded-xl` card with success header strip
- Controls: `CopyLinkBar` (`rounded-lg` field chrome)
- Semantic tokens: `bg-surface`, `text-text`, `text-muted`, `border-success/20`, `bg-success/10`

## Dependencies

- Parent: `ManualOnboardAgentContent`
- Labels/state: `useManualOnboardAgentModal`
