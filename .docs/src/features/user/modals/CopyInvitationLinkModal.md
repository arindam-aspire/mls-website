# `CopyInvitationLinkModal`

**Source:** `src/features/user/modals/CopyInvitationLinkModal.tsx`

## File Overview

Modal shown after a successful **Resend invitation** so the agency admin can copy the new invitation URL. Reuses `InviteAgentReadyPanel` for the success + copy-link UI.

## Responsibilities

- Present the invitation URL in a `CopyLinkBar` via `InviteAgentReadyPanel`
- Allow copy-to-clipboard (handler from parent) and close
- Preserve existing invite-ready visual language

## Imports

- `@/src/components/ui` — `Button`
- `@/src/components/ui/modal` — modal primitives
- `InviteAgentReadyPanel`

## Exports

- `CopyInvitationLinkModal`
- `CopyInvitationLinkModalProps`

## Props / Parameters

| Prop | Purpose |
| --- | --- |
| `open` / `onClose` | Modal visibility |
| `readyTitle`, `generatedMessage`, `shareHint` | Localized copy |
| `linkLabel`, `inviteLink`, `copyLinkLabel` | Link bar |
| `closeLabel` | Primary footer close button |
| `onCopyLink` | Clipboard action |

## UI Details

- `rounded-xl` modal panel (via shared Modal)
- Footer close button uses `rounded-lg`
- Responsive full-width button on small screens (`w-full sm:w-auto`)

## Flow Description

1. Parent opens modal with `inviteLink` from resend API (`invitation_url` / `inviteLink`).
2. User copies link or closes.
3. Success toast for resend remains handled by `useResendAgentInvitation` mutation.

## Dependencies

- `useResendAgentInvitationConfirm` → `AgentsScreen`
- `InviteAgentReadyPanel`
