"use client";

import {
  Popover as HeadlessPopover,
  PopoverBackdrop as HeadlessPopoverBackdrop,
  PopoverButton as HeadlessPopoverButton,
  PopoverGroup as HeadlessPopoverGroup,
  PopoverPanel as HeadlessPopoverPanel,
} from "@headlessui/react";
import { useLocale } from "next-intl";
import { cn } from "@/src/lib/cn";
import {
  controlTextClasses,
  popoverPanelTextClasses,
  popoverTitleClasses,
} from "@/src/lib/typography";
import { isRtlLocale } from "@/src/i18n/routing";
import type {
  PopoverBackdropWrapperProps,
  PopoverContentProps,
  PopoverGroupWrapperProps,
  PopoverHeaderProps,
  PopoverPanelWrapperProps,
  PopoverRootProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "./types";

function mergeHeadlessClassName<TBag>(
  base: string,
  className?: string | ((bag: TBag) => string),
): string | ((bag: TBag) => string) {
  if (typeof className === "function") {
    return (bag: TBag) => cn(base, className(bag));
  }
  return cn(base, className);
}

const triggerBaseClasses = cn(
  "inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 font-medium text-text transition-colors",
  controlTextClasses.md,
  "hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
  "data-active:bg-page data-disabled:cursor-not-allowed data-disabled:opacity-50",
);

const backdropClasses = cn(
  "fixed inset-0 z-40 bg-black/25 transition-opacity",
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

const panelBaseClasses = cn(
  "z-50 max-h-[min(24rem,calc(100vh-2rem))] min-w-48 w-(--button-width) max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-secondary/15 bg-surface p-2 text-text shadow-lg ring-1 ring-black/5",
  popoverPanelTextClasses,
  "[scrollbar-width:thin] focus:outline-none [--anchor-gap:0.5rem]",
  "transition duration-150 ease-out",
  "data-closed:scale-95 data-closed:opacity-0",
  "data-enter:scale-100 data-enter:opacity-100",
  "data-leave:scale-95 data-leave:opacity-0",
);

const panelFullScreenClasses = cn(
  "fixed inset-0 z-[100] flex h-dvh w-full max-w-none flex-col overflow-y-auto rounded-none border-0 bg-page text-text shadow-none ring-0 outline-none",
  "transition duration-200 ease-out",
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

export function PopoverGroup({
  className,
  children,
  ...rest
}: PopoverGroupWrapperProps) {
  return (
    <HeadlessPopoverGroup
      className={mergeHeadlessClassName("", className)}
      {...rest}
    >
      {children}
    </HeadlessPopoverGroup>
  );
}

export function Popover({ className, children, ...rest }: PopoverRootProps) {
  return (
    <HeadlessPopover
      className={mergeHeadlessClassName("relative", className)}
      {...rest}
    >
      {children}
    </HeadlessPopover>
  );
}

export function PopoverButton({
  className,
  children,
  ...rest
}: PopoverTriggerProps) {
  return (
    <HeadlessPopoverButton
      className={mergeHeadlessClassName(triggerBaseClasses, className)}
      {...rest}
    >
      {children}
    </HeadlessPopoverButton>
  );
}

export function PopoverBackdrop({
  className,
  transition = true,
  ...rest
}: PopoverBackdropWrapperProps) {
  return (
    <HeadlessPopoverBackdrop
      transition={transition}
      className={mergeHeadlessClassName(backdropClasses, className)}
      {...rest}
    />
  );
}

export function PopoverPanel({
  className,
  children,
  fullScreen = false,
  anchor: anchorProp,
  modal: modalProp,
  transition = true,
  ...rest
}: PopoverPanelWrapperProps) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const anchor =
    anchorProp ?? (isRtl ? "bottom end" : "bottom start");

  return (
    <HeadlessPopoverPanel
      {...(fullScreen ? { modal: modalProp ?? true } : { anchor, modal: modalProp })}
      transition={transition}
      className={mergeHeadlessClassName(
        fullScreen ? panelFullScreenClasses : panelBaseClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </HeadlessPopoverPanel>
  );
}

export function PopoverHeader({ className, children, ...rest }: PopoverHeaderProps) {
  return (
    <div
      className={cn(
        "border-b border-secondary/15 px-3 py-2.5 text-start",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function PopoverTitle({ className, children, ...rest }: PopoverTitleProps) {
  return (
    <h3
      className={cn(popoverTitleClasses, className)}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function PopoverContent({ className, children, ...rest }: PopoverContentProps) {
  return (
    <div className={cn("px-3 py-2.5 text-start", className)} {...rest}>
      {children}
    </div>
  );
}

export type {
  PopoverBackdropWrapperProps,
  PopoverContentProps,
  PopoverGroupWrapperProps,
  PopoverHeaderProps,
  PopoverPanelWrapperProps,
  PopoverRootProps,
  PopoverTitleProps,
  PopoverTriggerProps,
} from "./types";

