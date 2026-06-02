"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/src/lib/cn";
import {
  toggleBorderedTrackInsetClasses,
  toggleIconSizeClasses,
  toggleSegmentSizeClasses,
  toggleShellSizeClasses,
  toggleTrackInsetClasses,
} from "../responsiveSizes";
import type {
  ToggleButtonColor,
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "./types";

const containerVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-primary-light",
  },
  secondary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  tertiary: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  inherit: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  danger: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
  success: {
    solid: "border border-secondary/30 bg-surface",
    outline: "border border-secondary/15 bg-surface",
    ghost: "border border-transparent bg-transparent",
  },
};

const slideVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "bg-primary",
    outline: "bg-primary",
    ghost: "bg-page",
  },
  secondary: {
    solid: "bg-secondary",
    outline: "bg-secondary",
    ghost: "bg-secondary-light",
  },
  tertiary: {
    solid: "bg-tertiary-dark",
    outline: "bg-tertiary-dark",
    ghost: "bg-tertiary-light",
  },
  inherit: {
    solid: "bg-inherit-color",
    outline: "bg-inherit-color",
    ghost: "bg-inherit-color/15",
  },
  danger: {
    solid: "bg-danger",
    outline: "bg-danger",
    ghost: "bg-danger/10",
  },
  success: {
    solid: "bg-success",
    outline: "bg-success",
    ghost: "bg-success/10",
  },
};

const activeLabelVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-text",
  },
  secondary: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-secondary",
  },
  tertiary: {
    solid: "text-text",
    outline: "text-text",
    ghost: "text-tertiary-dark",
  },
  inherit: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-inherit-color",
  },
  danger: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-danger",
  },
  success: {
    solid: "text-white",
    outline: "text-white",
    ghost: "text-success",
  },
};

const inactiveLabelVariantClasses: Record<
  ToggleButtonColor,
  Record<ToggleButtonVariant, string>
> = {
  primary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-primary-dark",
  },
  secondary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-secondary",
  },
  tertiary: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-tertiary-dark",
  },
  inherit: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-inherit-color",
  },
  danger: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-danger",
  },
  success: {
    solid: "text-muted data-hover:text-text",
    outline: "text-text data-hover:text-text",
    ghost: "text-muted data-hover:text-success",
  },
};

const shellSizeClasses = toggleShellSizeClasses;

const trackInsetClasses = toggleTrackInsetClasses;

const borderedTrackInsetClasses = toggleBorderedTrackInsetClasses;

const segmentSizeClasses = toggleSegmentSizeClasses;

const iconSizeClasses = toggleIconSizeClasses;

function ToggleButtonIcon({
  icon,
  size,
}: {
  icon: ReactNode;
  size: ToggleButtonSize;
}) {
  return (
    <span
      className={cn("inline-flex [&>svg]:size-full", iconSizeClasses[size])}
      aria-hidden
    >
      {icon}
    </span>
  );
}

export function ToggleButton<T extends string = string>({
  items,
  value: valueProp,
  defaultValue,
  onChange,
  color = "primary",
  variant = "solid",
  size = "md",
  isRounded = false,
  fullWidth = false,
  className,
  disabled = false,
  "aria-label": ariaLabel,
  id,
}: ToggleButtonProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<(HTMLElement | null)[]>([]);
  const [indicator, setIndicator] = useState({
    width: 0,
    left: 0,
    top: 0,
    height: 0,
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    () => defaultValue ?? items[0]?.value ?? ("" as T),
  );
  const isControlled = valueProp !== undefined;
  const selectedValue = isControlled ? valueProp : uncontrolledValue;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.value === selectedValue),
  );

  const updateIndicator = useCallback(() => {
    const track = trackRef.current;
    const segment = segmentRefs.current[activeIndex];
    if (!track || !segment) {
      return;
    }
    const trackRect = track.getBoundingClientRect();
    const segmentRect = segment.getBoundingClientRect();
    setIndicator({
      left: segmentRect.left - trackRect.left,
      width: segmentRect.width,
      top: segmentRect.top - trackRect.top,
      height: segmentRect.height,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateIndicator();
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const observer = new ResizeObserver(updateIndicator);
    observer.observe(track);
    window.addEventListener("resize", updateIndicator);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, items, selectedValue, size, fullWidth, variant]);

  const handleItemClick = (
    item: (typeof items)[number],
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (disabled || item.disabled) {
      return;
    }
    if (!isControlled) {
      setUncontrolledValue(item.value);
    }
    onChange?.(item.value);
    item.onClick?.(event);
  };

  const roundedContainer = isRounded ? "rounded-full" : "rounded-lg";
  const roundedSlide = isRounded ? "rounded-full" : "rounded-md";
  const usesBorderedTrack = variant === "solid" || variant === "outline";
  const trackPaddingClasses = usesBorderedTrack
    ? borderedTrackInsetClasses[size]
    : trackInsetClasses[size];

  return (
    <div
      id={id}
      role="group"
      aria-label={ariaLabel}
      ref={containerRef}
      className={cn(
        "inline-flex min-h-0 overflow-hidden",
        roundedContainer,
        shellSizeClasses[size],
        containerVariantClasses[color][variant],
        fullWidth && "w-full",
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          "relative flex min-h-0 w-full flex-1 items-stretch",
          trackPaddingClasses,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-0 transition-[left,width,top,height] duration-300 ease-out",
            roundedSlide,
            slideVariantClasses[color][variant],
          )}
          style={{
            left: indicator.left,
            width: indicator.width,
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.width > 0 ? 1 : 0,
          }}
        />
        {items.map((item, index) => {
          const isSelected = selectedValue === item.value;
          const isItemDisabled = disabled || item.disabled;

          return (
            <HeadlessButton
              suppressHydrationWarning
              key={String(item.value)}
              ref={(node) => {
                segmentRefs.current[index] = node;
              }}
              type="button"
              disabled={isItemDisabled}
              aria-pressed={isSelected}
              aria-disabled={isItemDisabled || undefined}
              onClick={(event) => handleItemClick(item, event)}
              className={cn(
                "relative z-10 inline-flex min-h-0 min-w-0 flex-1 items-center justify-center bg-transparent font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-1",
                "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                segmentSizeClasses[size],
                isSelected
                  ? activeLabelVariantClasses[color][variant]
                  : inactiveLabelVariantClasses[color][variant],
              )}
            >
              {item.iconStart != null && (
                <ToggleButtonIcon icon={item.iconStart} size={size} />
              )}
              <span className="truncate">{item.label}</span>
              {item.iconEnd != null && (
                <ToggleButtonIcon icon={item.iconEnd} size={size} />
              )}
            </HeadlessButton>
          );
        })}
      </div>
    </div>
  );
}

export {
  TOGGLE_BUTTON_COLORS,
  TOGGLE_BUTTON_SIZES,
  TOGGLE_BUTTON_VARIANTS,
} from "./types";
export type {
  ToggleButtonColor,
  ToggleButtonItem,
  ToggleButtonProps,
  ToggleButtonSize,
  ToggleButtonVariant,
} from "./types";

