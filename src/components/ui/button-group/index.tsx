"use client";

import { useState } from "react";
import { Button } from "../button";
import type {
  ButtonGroupItem,
  ButtonGroupOrientation,
  ButtonGroupProps,
  ButtonGroupRounded,
} from "./types";

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function itemButtonClassName(
  index: number,
  count: number,
  orientation: ButtonGroupOrientation,
  rounded: ButtonGroupRounded,
) {
  const isHorizontal = orientation === "horizontal";

  if (rounded === "top-only") {
    return cn(
      "rounded-none shadow-none",
      isHorizontal && "border-s-0 border-e border-secondary/30 last:border-e-0",
      !isHorizontal && "border-t-0 border-b border-secondary/30 last:border-b-0",
      index === 0 && (isHorizontal ? "rounded-tl-lg" : "rounded-t-lg"),
      index === count - 1 && isHorizontal && "rounded-tr-lg",
    );
  }

  return cn(
    "rounded-none shadow-none",
    isHorizontal && "border-s-0 border-e border-secondary/30 last:border-e-0",
    !isHorizontal && "border-t-0 border-b border-secondary/30 last:border-b-0",
    index === 0 && (isHorizontal ? "rounded-s-lg" : "rounded-t-lg"),
    index === count - 1 && (isHorizontal ? "rounded-e-lg" : "rounded-b-lg"),
  );
}

function groupRoundedClassName(rounded: ButtonGroupRounded) {
  if (rounded === "top-only") {
    return "rounded-t-lg rounded-b-none";
  }

  return "rounded-lg";
}

export function ButtonGroup<T extends string = string>({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  color = "primary",
  variant = "outline",
  selectedVariant = "solid",
  unselectedVariant,
  size = "md",
  orientation = "horizontal",
  rounded = "default",
  fullWidth = false,
  className,
  disabled = false,
  selectedClassName,
  unselectedClassName,
  "aria-label": ariaLabel,
  id,
}: ButtonGroupProps<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    () => defaultValue ?? items[0]?.value ?? ("" as T),
  );
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : uncontrolledValue;

  const hasCustomSelectionStyles =
    selectedClassName != null || unselectedClassName != null;

  const resolvedUnselectedVariant = hasCustomSelectionStyles
    ? (unselectedVariant ?? "ghost")
    : (unselectedVariant ?? variant);

  const resolvedSelectedVariant = hasCustomSelectionStyles
    ? (selectedVariant ?? "ghost")
    : selectedVariant;

  const handleItemClick = (
    item: ButtonGroupItem<T>,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (!isControlled) {
      setUncontrolledValue(item.value);
    }
    onChange?.(item.value);
    item.onClick?.(event);
  };

  return (
    <div
      id={id}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex overflow-hidden border border-secondary/30 bg-surface",
        groupRoundedClassName(rounded),
        orientation === "vertical" && "flex-col",
        fullWidth && "flex w-full",
        className,
      )}
    >
      {items.map((item, index) => {
        const isSelected = selectedValue === item.value;

        return (
          <Button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            color={color}
            variant={isSelected ? resolvedSelectedVariant : resolvedUnselectedVariant}
            size={size}
            disabled={disabled || item.disabled}
            onClick={(event) => handleItemClick(item, event)}
            className={cn(
              itemButtonClassName(index, items.length, orientation, rounded),
              isSelected ? selectedClassName : unselectedClassName,
              fullWidth && "flex-1",
            )}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

export type {
  ButtonGroupItem,
  ButtonGroupOrientation,
  ButtonGroupProps,
  BUTTON_GROUP_ORIENTATIONS,
  BUTTON_GROUP_ROUNDED,
  ButtonGroupRounded,
} from "./types";
