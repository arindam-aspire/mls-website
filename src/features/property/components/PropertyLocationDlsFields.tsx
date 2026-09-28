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

      if (!target?.isConnected || !form.contains(target)) {
        target?.remove();
        target = document.createElement("div");
        target.className = "contents";
        target.dataset.propertyLocationDlsPortal = "true";
        form.appendChild(target);
        setPortalTarget(target);
      } else if (target.parentElement !== form || form.lastElementChild !== target) {
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
