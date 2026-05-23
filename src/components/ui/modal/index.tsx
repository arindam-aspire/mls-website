"use client";

import {
  CloseButton,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ChevronLeft, X } from "lucide-react";
import { createContext, useContext } from "react";
import { cn } from "@/src/lib/cn";
import type {
  ModalBackdropProps,
  ModalBackButtonProps,
  ModalCloseButtonProps,
  ModalContainerProps,
  ModalContentProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalPanelProps,
  ModalProps,
  ModalSize,
  ModalTitleProps,
} from "./types";

const ModalSizeContext = createContext<ModalSize>("md");

function useModalSize(panelSize?: ModalSize): ModalSize {
  const contextSize = useContext(ModalSizeContext);
  return panelSize ?? contextSize;
}

const panelSizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-[430px]",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

function mergeHeadlessClassName<TBag>(
  base: string,
  className?: string | ((bag: TBag) => string),
): string | ((bag: TBag) => string) {
  if (typeof className === "function") {
    return (bag: TBag) => cn(base, className(bag));
  }
  return cn(base, className);
}

const backdropClasses = cn(
  "fixed inset-0 bg-black/65 transition-opacity",
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

const containerClasses =
  "fixed inset-0 z-50 w-screen overflow-y-auto p-4 sm:p-6";

const containerInnerClasses =
  "flex min-h-full justify-center";

const panelBaseClasses = cn(
  "relative my-auto w-full rounded-xl border border-secondary/15 bg-surface text-text shadow-lg",
  "transition duration-200 ease-out",
  "data-closed:scale-95 data-closed:opacity-0",
  "data-enter:scale-100 data-enter:opacity-100",
  "data-leave:scale-95 data-leave:opacity-0",
);

export function Modal({
  className,
  children,
  size = "md",
  transition = true,
  ...rest
}: ModalProps) {
  return (
    <ModalSizeContext.Provider value={size}>
      <Dialog
        transition={transition}
        className={mergeHeadlessClassName("relative z-50", className)}
        {...rest}
      >
        {children}
      </Dialog>
    </ModalSizeContext.Provider>
  );
}

export function ModalBackdrop({
  className,
  transition = true,
  ...rest
}: ModalBackdropProps) {
  return (
    <DialogBackdrop
      transition={transition}
      className={mergeHeadlessClassName(backdropClasses, className)}
      {...rest}
    />
  );
}

export function ModalContainer({
  className,
  children,
  ...rest
}: ModalContainerProps) {
  return (
    <div className={cn(containerClasses, className)} {...rest}>
      <div className={containerInnerClasses}>{children}</div>
    </div>
  );
}

export function ModalPanel({
  className,
  children,
  size: sizeProp,
  transition = true,
  ...rest
}: ModalPanelProps) {
  const size = useModalSize(sizeProp);

  return (
    <DialogPanel
      transition={transition}
      className={mergeHeadlessClassName(
        cn(panelBaseClasses, panelSizeClasses[size]),
        className,
      )}
      {...rest}
    >
      {children}
    </DialogPanel>
  );
}

export function ModalHeader({ className, children, ...rest }: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-secondary/15 px-4 pt-4 pb-4 sm:px-6 sm:pt-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function ModalTitle({ className, children, ...rest }: ModalTitleProps) {
  return (
    <DialogTitle
      className={mergeHeadlessClassName(
        "min-w-0 flex-1 text-lg font-semibold leading-tight text-text sm:text-xl",
        className,
      )}
      {...rest}
    >
      {children}
    </DialogTitle>
  );
}

export function ModalDescription({
  className,
  children,
  ...rest
}: ModalDescriptionProps) {
  return (
    <Description
      className={mergeHeadlessClassName("mt-1.5 text-sm text-muted", className)}
      {...rest}
    >
      {children}
    </Description>
  );
}

export function ModalContent({
  className,
  children,
  ...rest
}: ModalContentProps) {
  return (
    <div className={cn("py-4 sm:py-6", className)} {...rest}>
      {children}
    </div>
  );
}

export function ModalFooter({ className, children, ...rest }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-secondary/15 px-4 pt-4 pb-4 sm:flex-row sm:justify-end sm:gap-2 sm:px-6 sm:pb-6",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

const modalCornerButtonClasses =
  "absolute top-1.5 z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40";

export function ModalBackButton({
  className,
  "aria-label": ariaLabel = "Back",
  type = "button",
  ...rest
}: ModalBackButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn(modalCornerButtonClasses, "start-1.5", className)}
      {...rest}
    >
      <ChevronLeft className="size-5" aria-hidden />
    </button>
  );
}

export function ModalCloseButton({
  className,
  "aria-label": ariaLabel = "Close",
  ...rest
}: ModalCloseButtonProps) {
  return (
    <CloseButton
      type="button"
      aria-label={ariaLabel}
      className={cn(modalCornerButtonClasses, "end-1.5", className)}
      {...rest}
    >
      <X className="size-5" aria-hidden />
    </CloseButton>
  );
}

export type {
  ModalBackdropProps,
  ModalBackButtonProps,
  ModalCloseButtonProps,
  ModalContainerProps,
  ModalContentProps,
  ModalDescriptionProps,
  ModalFooterProps,
  ModalHeaderProps,
  ModalPanelProps,
  ModalProps,
  ModalSize,
  ModalTitleProps,
} from "./types";
export { MODAL_SIZES } from "./types";

