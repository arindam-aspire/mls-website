# File Overview

Per-step dirty detection for **Create Property** by comparing serialized `PropertyFormValues` sections against the last saved snapshot.

**Source:** `src/features/property/utils/propertyCreateDirtyState.utils.ts`

# Responsibilities

- Map each `propertyFormSteps` id to a `PropertyFormValues` section via [propertyCreateFormSteps.constants.md](../constants/propertyCreateFormSteps.constants.md).
- `buildPropertyCreateStepSnapshot` — JSON snapshot per step.
- `computeDirtyPropertyCreateSteps` — step ids that differ from saved baseline.
- `hasPropertyCreateUnsavedChanges` — boolean guard helper.

# Notes

- Step metadata (`active_step`, `max_reached_step`) is excluded from section comparisons.
- Baseline updates after draft hydrate, successful **Save as Draft**, submit success, and initial form mount baseline in `usePropertyCreateScreen`.
