# File Overview

Three-action confirmation modal for unsaved **Create Property** edits.

**Source:** `src/features/property/components/PropertyCreateUnsavedChangesModal.tsx`

# Responsibilities

- Present warning icon, title, and description from `propertyList.propertyCreate.unsavedChanges` i18n.
- Footer actions: **Cancel** (ghost), **Discard** (danger outline), **Save as Draft** (primary, shows draft-saving spinner).

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `open` | Modal visibility |
| `title`, `description` | Copy |
| `saveDraftLabel`, `discardLabel`, `cancelLabel`, `savingDraftLabel` | Button labels |
| `isSavingDraft` | Disables Cancel/Discard while draft save runs |
| `onSaveDraft`, `onDiscard`, `onCancel` | Action handlers |

# UI Details

- `rounded-xl` modal panel (`size="md"`); buttons `rounded-lg` in a single horizontal row with wrapped labels (`[&>span]:whitespace-normal`) so **Save as Draft** is not truncated.
- Light/dark warning icon treatment (`bg-amber-50` / `dark:bg-amber-950`).

# Dependencies

- [usePropertyCreateUnsavedChanges.md](../hooks/usePropertyCreateUnsavedChanges.md)
- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
