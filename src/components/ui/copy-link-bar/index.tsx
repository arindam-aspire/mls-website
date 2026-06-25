"use client";

import { Field, Label } from "@headlessui/react";
import { Copy } from "lucide-react";
import { useId } from "react";
import { cn } from "@/src/lib/cn";
import { fieldLabelSizeClasses } from "../responsiveSizes";
import type { CopyLinkBarProps } from "./types";

export function CopyLinkBar({
  value,
  copyLabel,
  onCopy,
  label,
  labelClassName,
  className,
  disabled = false,
}: CopyLinkBarProps) {
  const generatedId = useId();
  const valueId = `${generatedId}-value`;

  return (
    <Field className={cn("w-full", className)} disabled={disabled}>
      {label ? (
        <Label
          className={cn(
            "mb-1.5 block font-medium text-text",
            fieldLabelSizeClasses,
            labelClassName,
          )}
        >
          {label}
        </Label>
      ) : null}

      <div
        className={cn(
          "flex min-w-0 items-center gap-2 rounded-lg border border-secondary/15 bg-page px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <p
          id={valueId}
          className="min-w-0 flex-1 truncate text-sm text-text"
          title={value}
        >
          {value}
        </p>

        <div className="h-5 w-px shrink-0 bg-secondary/20" aria-hidden />

        <button
          type="button"
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-primary transition-colors",
            "hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          disabled={disabled}
          onClick={onCopy}
        >
          <Copy className="size-4 shrink-0" aria-hidden />
          <span className="whitespace-nowrap">{copyLabel}</span>
        </button>
      </div>
    </Field>
  );
}

export type { CopyLinkBarProps } from "./types";
