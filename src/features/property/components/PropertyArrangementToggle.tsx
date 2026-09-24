"use client";

import { ToggleButton, type ToggleButtonItem } from "@/src/components/ui";
import type { PropertyArrangementId } from "@/src/features/property/constants/propertyArrangement.constants";
import { cn } from "@/src/lib/cn";

export type PropertyArrangementToggleProps = {
  value: PropertyArrangementId;
  onChange: (value: PropertyArrangementId) => void;
  items: ToggleButtonItem[];
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
};

export function PropertyArrangementToggle({
  value,
  onChange,
  items,
  ariaLabel,
  disabled = false,
  className,
}: PropertyArrangementToggleProps) {
  return (
    <ToggleButton
      className={cn("w-full min-w-0", className)}
      color="primary"
      variant="solid"
      size="md"
      value={value}
      onChange={(next) => {
        if (next === "properties" || next === "land") {
          onChange(next);
        }
      }}
      items={items}
      aria-label={ariaLabel}
      disabled={disabled}
    />
  );
}
