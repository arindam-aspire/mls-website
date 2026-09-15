"use client";

import { Button, Select } from "@/src/components/ui";
import type { PropertyLocationDlsFieldModel } from "@/src/features/property/hooks/usePropertyLocationDls";
import { Landmark } from "lucide-react";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";

export type PropertyLocationDlsFieldsProps = {
  sectionTitle: string;
  fields: PropertyLocationDlsFieldModel[];
};

export function PropertyLocationDlsFields({
  sectionTitle,
  fields,
}: PropertyLocationDlsFieldsProps) {
  const [locationForm, setLocationForm] = useState<HTMLFormElement | null>(null);

  const setAnchorRef = useCallback((anchor: HTMLSpanElement | null) => {
    if (anchor) {
      setLocationForm(anchor.parentElement?.querySelector("form") ?? null);
    }
  }, []);

  return (
    <>
      <span ref={setAnchorRef} hidden aria-hidden />
      {locationForm
        ? createPortal(
            <div className="contents">
              <h3 className="col-span-1 mt-1 flex items-center gap-2 border-t border-secondary/15 pt-3 text-xs font-bold tracking-[0.08em] text-secondary uppercase sm:text-sm md:col-span-2">
                <Landmark className="size-5 shrink-0 text-secondary" aria-hidden />
                {sectionTitle}
              </h3>
              {fields.map((field) => (
                <div key={field.id} className="flex min-w-0 flex-col gap-2">
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
              ))}
            </div>,
            locationForm,
          )
        : null}
    </>
  );
}
