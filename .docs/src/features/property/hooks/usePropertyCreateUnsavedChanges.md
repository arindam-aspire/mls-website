# File Overview

Guards **Create Property** against losing in-progress edits: custom modal for in-app navigation and keyboard refresh; no native browser leave dialog.

**Source:** `src/features/property/hooks/usePropertyCreateUnsavedChanges.ts`

# Responsibilities

- Compare `propertyDetails` from `usePropertyCreateScreen` against the last saved snapshot (draft save, draft hydrate, or initial baseline). Updates when the parent form state changes (e.g. step navigation, draft save).
- `commitSavedSnapshot` synchronously disables the active guard before clearing React dirty state. This prevents a successful Submit redirect from being intercepted during the render gap and opening the Save as Draft modal.
- Track dirty PropertyForm step ids (`setup`, `location`, `details`, …) using [propertyCreateDirtyState.utils.md](../utils/propertyCreateDirtyState.utils.md).
- Register a [navigationGuard.md](../../../navigation/navigationGuard.md) interceptor when unsaved and editable — blocks `router.push` / `replace` / `back` and imperative `navigateTo` until the user chooses an action.
- Intercept internal `<a>` clicks and browser **Back** (`popstate`) when guard is active. DOM `href` values are normalized via [stripLocalePrefixFromPath.md](../../../i18n/stripLocalePrefixFromPath.md) before `router.push` so paths like `/en/dashboard` do not become `/en/en/dashboard`.
- Intercept keyboard refresh (**F5**, **Ctrl/Cmd+R**) and show the custom modal (reload after **Save as Draft** or **Discard**). No `beforeunload` — avoids the native browser “Leave site?” alert on refresh.
- Expose modal props for [PropertyCreateUnsavedChangesModal.md](../components/PropertyCreateUnsavedChangesModal.md).

# Parameters

| Param | Purpose |
| --- | --- |
| `enabled` | Host catalog finished loading |
| `canEdit` | Read-only submitted forms skip the guard |
| `isDraftSaving` | Loading state for modal **Save as Draft** |
| `onDraft` | Existing draft save handler; must return `true` on success |
| `propertyDetails` | Current `PropertyFormValues` owned by the create screen hook |

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| **Save as Draft** | Calls `onDraft` with live payload; navigates or reloads on success |
| **Discard** | Clears guard and completes pending navigation/reload without saving |
| **Cancel** | Closes modal; user stays on create page |

# Notes

- **F5 / Ctrl/Cmd+R:** Custom modal only — no native browser alert.
- **Browser toolbar refresh button:** Browsers do not allow a custom modal here; the page reloads without a prompt (same security limit as tab close). Use keyboard refresh or in-app navigation to get the three-option modal.
- Successful property submission commits the saved snapshot before navigation, so the redirect proceeds immediately without this modal.

# Dependencies

- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
- [propertyCreateFormSteps.constants.md](../constants/propertyCreateFormSteps.constants.md)
- [navigationGuard.md](../../../navigation/navigationGuard.md)
