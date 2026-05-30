"use client";

import { cn } from "@/src/lib/cn";
import {
  toastDescriptionClasses,
  toastTitleClasses,
} from "@/src/lib/typography";
import { useToastContext } from "@/src/hooks/useToast";
import { CloseIcon, ToastIcon } from "./ToastIcons";
import type { Toast, ToastPosition, ToastStyle, ToastVariant } from "./types";

type VariantConfig = {
  softBorder: string;
  solidBg: string;
  outlineBorder: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
};

const variantConfig: Record<ToastVariant, VariantConfig> = {
  success: {
    softBorder: "border-l-green-500",
    solidBg: "bg-green-600",
    outlineBorder: "border-green-500",
    iconBg: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
    titleColor: "text-green-800 dark:text-green-300",
  },
  error: {
    softBorder: "border-l-red-500",
    solidBg: "bg-red-600",
    outlineBorder: "border-red-500",
    iconBg: "bg-red-50 dark:bg-red-950",
    iconColor: "text-red-600 dark:text-red-400",
    titleColor: "text-red-800 dark:text-red-300",
  },
  warning: {
    softBorder: "border-l-amber-500",
    solidBg: "bg-amber-600",
    outlineBorder: "border-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-950",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-800 dark:text-amber-300",
  },
  info: {
    softBorder: "border-l-blue-500",
    solidBg: "bg-blue-600",
    outlineBorder: "border-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-800 dark:text-blue-300",
  },
};

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
  styleVariant: ToastStyle;
}

function ToastItem({ toast, onDismiss, styleVariant }: ToastItemProps) {
  const c = variantConfig[toast.variant];
  const isSolid = styleVariant === "solid";

  const wrapperBase =
    "pointer-events-auto flex w-80 max-w-sm items-start gap-3 rounded-xl px-4 py-3 " +
    "animate-in slide-in-from-right-8 fade-in duration-300";

  const wrapperStyles: Record<ToastStyle, string> = {
    soft: cn(
      wrapperBase,
      "border border-zinc-200 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900",
      "border-l-4 rounded-l-none",
      c.softBorder,
    ),
    solid: cn(wrapperBase, c.solidBg, "shadow-md"),
    outline: cn(
      wrapperBase,
      "border-2 bg-white shadow-sm dark:bg-zinc-900",
      c.outlineBorder,
    ),
  };

  return (
    <div role="alert" aria-live="assertive" className={wrapperStyles[styleVariant]}>
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
          isSolid ? "bg-white/20 text-white" : cn(c.iconBg, c.iconColor),
        )}
      >
        <ToastIcon variant={toast.variant} />
      </span>

      <div className="min-w-0 flex-1">
        {toast.title && (
          <p
            className={cn(
              "leading-snug font-semibold",
              toastTitleClasses,
              isSolid ? "text-white" : c.titleColor,
            )}
          >
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p
            className={cn(
              "mt-0.5 leading-relaxed",
              toastDescriptionClasses,
              isSolid ? "text-white/80" : "text-zinc-500 dark:text-zinc-400",
            )}
          >
            {toast.description}
          </p>
        )}
      </div>

      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className={cn(
          "mt-0.5 flex-shrink-0 opacity-60 transition-opacity hover:opacity-100",
          isSolid
            ? "text-white"
            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200",
        )}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export interface ToasterProps {
  position?: ToastPosition;
  styleVariant?: ToastStyle;
}

export function Toaster({
  position = "top-right",
  styleVariant = "soft",
}: ToasterProps) {
  const { toasts, removeToast } = useToastContext();

  return (
    <div
      aria-label="Notifications"
      className={cn(
        "pointer-events-none fixed z-[9999] flex flex-col gap-2",
        positionClasses[position],
      )}
    >
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onDismiss={removeToast}
          styleVariant={styleVariant}
        />
      ))}
    </div>
  );
}
