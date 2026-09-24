import { PENDING_PROPERTY_REFERENCE_NUMBER } from "@/src/features/property/constants/propertyForm.constants";
import {
  PROPERTY_IDENTIFICATION_BUILT_IN_KEYS,
  PROPERTY_IDENTIFICATION_CUSTOM_KEYS,
  PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY,
} from "@/src/features/property/constants/propertyIdentification.constants";

const LIBRARY_OWNER_DOCUMENT_LABELS = new Set(["Owner Document", "Owner Documents"]);

const KNOWN_IDENTIFICATION_FIELD_NAMES = new Set<string>([
  ...PROPERTY_IDENTIFICATION_BUILT_IN_KEYS,
  ...PROPERTY_IDENTIFICATION_CUSTOM_KEYS,
  PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY,
]);

function hideBuiltUpAreaUnitControl(container: HTMLElement) {
  const unitControl = container.querySelector('[name="built_up_area_unit"]');
  if (!(unitControl instanceof HTMLElement)) {
    return;
  }

  let current: HTMLElement | null = unitControl;
  while (current && current !== container) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent || parent === container) {
      break;
    }

    const containsArea = Boolean(parent.querySelector('[name="built_up_area"]'));
    const containsUnit = Boolean(parent.querySelector('[name="built_up_area_unit"]'));
    if (containsArea && containsUnit) {
      current.hidden = true;
      current.setAttribute("aria-hidden", "true");
      return;
    }

    current = parent;
  }

  unitControl.hidden = true;
  unitControl.setAttribute("aria-hidden", "true");
}

function setElementHidden(element: HTMLElement, hidden: boolean) {
  element.hidden = hidden;

  if (hidden) {
    element.setAttribute("aria-hidden", "true");
    return;
  }

  element.removeAttribute("aria-hidden");
}

function findNamedFieldWrapper(
  control: HTMLElement,
  container: HTMLElement,
): HTMLElement {
  let wrapper = control;
  let current: HTMLElement | null = control;

  while (current && current !== container) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent || parent === container) {
      break;
    }

    if (parent.querySelectorAll("[name]").length > 1) {
      break;
    }

    wrapper = parent;
    current = parent;
  }

  return wrapper;
}

function syncReferenceNumberField(
  container: HTMLElement,
  hasReferenceNumber: boolean,
) {
  const referenceNumberInput = container.querySelector<HTMLInputElement>(
    'input[name="reference_number"]',
  );

  if (!referenceNumberInput) {
    return;
  }

  referenceNumberInput.readOnly = true;
  referenceNumberInput.setAttribute("aria-readonly", "true");

  const trimmedValue = referenceNumberInput.value.trim();
  const isPendingPlaceholder = trimmedValue === PENDING_PROPERTY_REFERENCE_NUMBER;
  const shouldShow =
    (hasReferenceNumber || Boolean(trimmedValue)) && !isPendingPlaceholder;
  const wrapper = findNamedFieldWrapper(referenceNumberInput, container);

  setElementHidden(wrapper, !shouldShow);

  if (!referenceNumberInput.id) {
    return;
  }

  const labelSelector = `label[for="${CSS.escape(referenceNumberInput.id)}"]`;
  container.querySelectorAll(labelSelector).forEach((label) => {
    if (label instanceof HTMLElement && !wrapper.contains(label)) {
      setElementHidden(label, !shouldShow);
    }
  });
}

function applyOwnerDocumentLabels(container: HTMLElement, label: string) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent?.trim() ?? "";
    if (LIBRARY_OWNER_DOCUMENT_LABELS.has(text) && node.textContent !== label) {
      node.textContent = label;
    }
    node = walker.nextNode();
  }
}

/**
 * Library identification fields are always text inputs. Promote Floor Number to
 * a numeric control without patching `@abdoun/abdoun-library`. Kept for any
 * still-visible library identification inputs; host DLS text fields set
 * `type="number"` directly.
 */
function applyFloorNumberNumericInput(container: HTMLElement) {
  const floorNumberInput = container.querySelector<HTMLInputElement>(
    'input[name="floor_number"]',
  );

  if (!floorNumberInput) {
    return;
  }

  if (floorNumberInput.type !== "number") {
    floorNumberInput.type = "number";
  }

  floorNumberInput.inputMode = "numeric";
  floorNumberInput.step = "1";
}

/**
 * Shows only arrangement-allowed identification fields. On Create Property the
 * host DLS section owns free-text identification, so the create screen passes
 * an empty visible list to hide library duplicates (including Basin Number and
 * the empty-array placeholder key).
 */
function isHostDlsIdentificationControl(control: HTMLElement): boolean {
  return Boolean(
    control.closest("[data-property-location-dls-portal]") ||
      control.closest("[data-dls-field-id]"),
  );
}

function syncIdentificationFieldVisibility(
  container: HTMLElement,
  visibleKeys: readonly string[],
) {
  const allowed = new Set(visibleKeys);

  for (const control of container.querySelectorAll<HTMLElement>("[name]")) {
    const name = control.getAttribute("name");
    if (!name || !KNOWN_IDENTIFICATION_FIELD_NAMES.has(name)) {
      continue;
    }

    const wrapper = findNamedFieldWrapper(control, container);

    // Host DLS Inputs reuse the same `name`s as library identification fields.
    // Keep them visible; only hide the library duplicates.
    if (isHostDlsIdentificationControl(control)) {
      setElementHidden(wrapper, false);
      continue;
    }

    setElementHidden(wrapper, !allowed.has(name));
  }
}

/**
 * Review step renders identification as label/value pairs (no `name`). Hide the
 * Land host placeholder row (zero-width label).
 */
function hideLandIdentificationPlaceholderReview(container: HTMLElement) {
  for (const dt of container.querySelectorAll("dt")) {
    if (!(dt instanceof HTMLElement) || dt.textContent !== "\u200b") {
      continue;
    }

    const wrapper = dt.parentElement;
    if (wrapper instanceof HTMLElement) {
      setElementHidden(wrapper, true);
    }
  }
}

export function applyPropertyCreateFormDomPatches(
  container: HTMLElement,
  options: {
    ownerDocumentsLabel: string;
    hasReferenceNumber: boolean;
    visibleIdentificationKeys: readonly string[];
  },
) {
  syncReferenceNumberField(container, options.hasReferenceNumber);
  hideBuiltUpAreaUnitControl(container);
  applyOwnerDocumentLabels(container, options.ownerDocumentsLabel);
  applyFloorNumberNumericInput(container);
  syncIdentificationFieldVisibility(
    container,
    options.visibleIdentificationKeys,
  );
  hideLandIdentificationPlaceholderReview(container);
}
