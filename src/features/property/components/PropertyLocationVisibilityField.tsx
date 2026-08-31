"use client";

import { SwitchField } from "@/src/components/ui";
import { MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";

type PropertyLocationVisibilityFieldProps = {
  checked: boolean;
  disabled?: boolean;
  title: string;
  description: string;
  ariaLabel: string;
  onChange: (checked: boolean) => void;
};

export function PropertyLocationVisibilityField({
  checked,
  disabled = false,
  title,
  description,
  ariaLabel,
  onChange,
}: PropertyLocationVisibilityFieldProps) {
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
            <SwitchField
              id="show-location"
              icon={<MapPin className="size-5" aria-hidden />}
              title={title}
              description={description}
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              aria-label={ariaLabel}
              className="col-span-full mt-1 border-t border-secondary/15 pt-3"
              switchClassName="before:absolute before:-inset-2 before:content-['']"
            />,
            locationForm,
          )
        : null}
    </>
  );
}
