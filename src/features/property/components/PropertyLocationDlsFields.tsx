"use client";

import { Button, Input, Select } from "@/src/components/ui";
import type { PropertyLocationDlsFieldModel } from "@/src/features/property/hooks/usePropertyLocationDls";
import { Landmark } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type PropertyLocationDlsFieldsProps = {
  sectionTitle: string;
  fields: PropertyLocationDlsFieldModel[];
};

const SHOW_LOCATION_CONTROL_ID = "show-location";

/** Walk up to the Location form’s direct child that wraps this control. */
function getFormChildAnchor(
  control: HTMLElement,
  form: HTMLFormElement,
): HTMLElement {
  let anchor: HTMLElement = control;
  let current: HTMLElement | null = control;

  while (current && current !== form) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent || parent === form) {
      break;
    }

    anchor = parent;
    current = parent;
  }

  return anchor;
}

function findShowLocationAnchor(form: HTMLFormElement): HTMLElement | null {
  const control = form.querySelector(`#${SHOW_LOCATION_CONTROL_ID}`);
  if (!(control instanceof HTMLElement) || !form.contains(control)) {
    return null;
  }

  const anchor = getFormChildAnchor(control, form);
  return anchor !== form ? anchor : null;
}

export function PropertyLocationDlsFields({
  sectionTitle,
  fields,
}: PropertyLocationDlsFieldsProps) {
  const sourceAnchorRef = useRef<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = sourceAnchorRef.current?.parentElement;

    if (!root) {
      return;
    }

    let target: HTMLDivElement | null = null;

    const mountDlsPortal = () => {
      const form = root.querySelector("form");
      if (!form) {
        return;
      }

      const insertBeforeNode = findShowLocationAnchor(form);
      const parent = insertBeforeNode?.parentElement ?? form;

      if (!target?.isConnected || !form.contains(target)) {
        target?.remove();
        target = document.createElement("div");
        target.className = "contents";
        target.dataset.propertyLocationDlsPortal = "true";
        if (insertBeforeNode && parent.contains(insertBeforeNode)) {
          parent.insertBefore(target, insertBeforeNode);
        } else {
          parent.appendChild(target);
        }
        setPortalTarget(target);
      } else if (
        insertBeforeNode &&
        target.nextElementSibling !== insertBeforeNode &&
        parent.contains(insertBeforeNode)
      ) {
        parent.insertBefore(target, insertBeforeNode);
      } else if (!insertBeforeNode && target.parentElement !== form) {
        form.appendChild(target);
      }
    };

    mountDlsPortal();

    const observer = new MutationObserver(mountDlsPortal);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      target?.remove();
    };
  }, []);

  return (
    <>
      <span ref={sourceAnchorRef} hidden aria-hidden />
      {portalTarget
        ? createPortal(
            <div className="contents">
              <h3 className="col-span-1 mt-1 flex items-center gap-2 border-t border-secondary/15 pt-3 text-xs font-bold tracking-[0.08em] text-secondary uppercase sm:text-sm md:col-span-2">
                <Landmark className="size-5 shrink-0 text-secondary" aria-hidden />
                {sectionTitle}
              </h3>
              {fields.map((field) => {
                if (field.kind === "text") {
                  return (
                    <div
                      key={field.id}
                      data-dls-field-id={field.id}
                      className="flex min-w-0 flex-col gap-2"
                    >
                      <Input
                        id={`property-dls-${field.id}`}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                        error={field.error}
                        disabled={field.disabled}
                        type={field.inputType ?? "text"}
                        inputMode={field.inputMode}
                        fullWidth
                      />
                    </div>
                  );
                }

                return (
                  <div
                    key={field.id}
                    data-dls-field-id={field.id}
                    className="flex min-w-0 flex-col gap-2"
                  >
                    <Select
                      id={`property-dls-${field.id}`}
                      name={field.name}
                      label={field.label}
                      placeholder={field.placeholder}
                      options={field.options}
                      value={field.value}
                      onChange={field.onChange}
                      error={field.error}
                      hint={field.hint}
                      disabled={field.disabled}
                      fullWidth
                    />
                    {field.onRetry && field.retryLabel ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={field.onRetry}
                        className="w-full sm:w-auto"
                      >
                        {field.retryLabel}
                      </Button>
                    ) : null}
                  </div>
                );
              })}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
