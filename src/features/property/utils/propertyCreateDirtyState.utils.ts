import {
  PROPERTY_CREATE_FORM_STEP_IDS,
  PROPERTY_CREATE_FORM_STEP_SECTIONS,
  type PropertyCreateFormStepId,
} from "@/src/features/property/constants/propertyCreateFormSteps.constants";
import type { PropertyFormValues } from "@abdoun/abdoun-library";

export type PropertyCreateStepSnapshot = Record<PropertyCreateFormStepId, string>;

function serializeSectionValue(value: unknown): string {
  return JSON.stringify(value ?? null);
}

export function buildPropertyCreateStepSnapshot(
  propertyDetails: PropertyFormValues,
): PropertyCreateStepSnapshot {
  return PROPERTY_CREATE_FORM_STEP_IDS.reduce((accumulator, stepId) => {
    const sectionKey = PROPERTY_CREATE_FORM_STEP_SECTIONS[stepId];
    accumulator[stepId] = serializeSectionValue(propertyDetails[sectionKey]);
    return accumulator;
  }, {} as PropertyCreateStepSnapshot);
}

export function computeDirtyPropertyCreateSteps(
  current: PropertyFormValues,
  savedSnapshot: PropertyCreateStepSnapshot,
): PropertyCreateFormStepId[] {
  const currentSnapshot = buildPropertyCreateStepSnapshot(current);

  return PROPERTY_CREATE_FORM_STEP_IDS.filter(
    (stepId) => currentSnapshot[stepId] !== savedSnapshot[stepId],
  );
}

export function hasPropertyCreateUnsavedChanges(
  current: PropertyFormValues,
  savedSnapshot: PropertyCreateStepSnapshot,
): boolean {
  return computeDirtyPropertyCreateSteps(current, savedSnapshot).length > 0;
}
