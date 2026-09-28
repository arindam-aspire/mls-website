"use client";

import { SwitchField } from "@/src/components/ui";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PropertyLocationVisibilityFieldProps = {
  checked: boolean;
  disabled?: boolean;
  title: string;
  description: string;
  ariaLabel: string;
  onChange: (checked: boolean) => void;
};

const MAP_ROOT_SELECTOR = "[data-property-location-map]";

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

function findMapSection(form: HTMLFormElement): HTMLElement | null {
  const map = form.querySelector(MAP_ROOT_SELECTOR);
  if (!(map instanceof HTMLElement) || !form.contains(map)) {
    return null;
  }

  const section = getFormChildAnchor(map, form);
  return section !== form ? section : null;
}

export function PropertyLocationVisibilityField({
  checked,
  disabled = false,
  title,
  description,
  ariaLabel,
  onChange,
}: PropertyLocationVisibilityFieldProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = anchorEl?.parentElement;
    if (!root) {
      return;
    }

    let target: HTMLDivElement | null = null;

    const mountShowLocation = () => {
      const form = root.querySelector("form");
      if (!form) {
        return;
      }

      const mapSection = findMapSection(form);

      if (!target?.isConnected || !form.contains(target)) {
        target?.remove();
        target = document.createElement("div");
        target.className = "contents";
        target.dataset.showLocationSlot = "true";
        if (mapSection) {
          mapSection.insertAdjacentElement("afterend", target);
        } else {
          form.appendChild(target);
        }
        setPortalTarget(target);
        return;
      }

      if (mapSection && target.previousElementSibling !== mapSection) {
        mapSection.insertAdjacentElement("afterend", target);
      }
    };

    mountShowLocation();

    const observer = new MutationObserver(mountShowLocation);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      target?.remove();
    };
  }, [anchorEl]);

  return (
    <>
      <span ref={setAnchorEl} hidden aria-hidden />
      {portalTarget
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
            portalTarget,
          )
        : null}
    </>
  );
}
