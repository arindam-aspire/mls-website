const LIBRARY_OWNER_DOCUMENT_LABELS = new Set(["Owner Document", "Owner Documents"]);

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

  const shouldShow =
    hasReferenceNumber || Boolean(referenceNumberInput.value.trim());
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

export function applyPropertyCreateFormDomPatches(
  container: HTMLElement,
  options: {
    ownerDocumentsLabel: string;
    hasReferenceNumber: boolean;
  },
) {
  syncReferenceNumberField(container, options.hasReferenceNumber);
  hideBuiltUpAreaUnitControl(container);
  applyOwnerDocumentLabels(container, options.ownerDocumentsLabel);
}
