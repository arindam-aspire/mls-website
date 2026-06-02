"use client";

import { Switch as HeadlessSwitch } from "@headlessui/react";
import { cn } from "@/src/lib/cn";
import type { SettingFieldProps, SwitchFieldProps, SwitchProps } from "./types";

const trackSizeClasses = {
  sm: "h-6 w-11",
  md: "h-7 w-12",
} as const;

const thumbSizeClasses = {
  sm: "size-5",
  md: "size-6",
} as const;

const trackColorClasses = {
  primary: "data-checked:bg-primary",
  secondary: "data-checked:bg-secondary",
} as const;

const fieldIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-text";

const fieldRowClass =
  "flex w-full items-center gap-3 py-3 sm:min-h-[3.75rem]";

export function SettingField({
  icon,
  iconClassName,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  controlClassName,
  children,
}: SettingFieldProps) {
  return (
    <div className={cn(fieldRowClass, className)}>
      {icon != null ? (
        <span className={cn(fieldIconClass, iconClassName)} aria-hidden>
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold text-text", titleClassName)}>{title}</p>
        {description != null && description !== "" ? (
          <p className={cn("mt-0.5 text-sm text-muted", descriptionClassName)}>{description}</p>
        ) : null}
      </div>
      <div className={cn("shrink-0", controlClassName)}>{children}</div>
    </div>
  );
}

export function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  color = "primary",
  size = "sm",
  className,
  id,
  name,
  "aria-label": ariaLabel,
}: SwitchProps) {
  return (
    <HeadlessSwitch
      id={id}
      name={name}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "group relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out",
        "bg-secondary/25 dark:bg-secondary/35",
        trackSizeClasses[size],
        trackColorClasses[color],
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-page",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none inline-block translate-x-0 rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
          "group-data-checked:translate-x-5",
          thumbSizeClasses[size],
        )}
      />
    </HeadlessSwitch>
  );
}

export function SwitchField({
  icon,
  iconClassName,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  className,
  titleClassName,
  descriptionClassName,
  switchClassName,
  color = "primary",
  size = "sm",
  id,
  "aria-label": ariaLabel,
}: SwitchFieldProps) {
  return (
    <SettingField
      icon={icon}
      iconClassName={iconClassName}
      title={title}
      description={description}
      className={className}
      titleClassName={titleClassName}
      descriptionClassName={descriptionClassName}
    >
      <Switch
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        color={color}
        size={size}
        className={switchClassName}
        aria-label={ariaLabel}
      />
    </SettingField>
  );
}

export { SWITCH_COLORS, SWITCH_SIZES } from "./types";
export type {
  SettingFieldProps,
  SwitchColor,
  SwitchFieldProps,
  SwitchProps,
  SwitchSize,
} from "./types";
