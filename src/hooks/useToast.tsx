"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type {
  Toast,
  ToastContextValue,
  ToastOptions,
  ToastVariant,
} from "@/src/types/toast.types";

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export function ToastProvider({
  children,
  duration = 4000,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      title,
      description,
      variant,
      duration: customDuration,
    }: Omit<Toast, "id">) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      setTimeout(() => removeToast(id), customDuration ?? duration);
    },
    [duration, removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}

export function useToast() {
  const { addToast } = useToastContext();

  const fire = useCallback(
    (variant: ToastVariant, title: string, options?: ToastOptions) =>
      addToast({ title, variant, ...options }),
    [addToast],
  );

  return {
    toast: (title: string, options?: ToastOptions) =>
      fire("info", title, options),
    success: (title: string, options?: ToastOptions) =>
      fire("success", title, options),
    error: (title: string, options?: ToastOptions) =>
      fire("error", title, options),
    warning: (title: string, options?: ToastOptions) =>
      fire("warning", title, options),
    info: (title: string, options?: ToastOptions) =>
      fire("info", title, options),

    promise: async <T,>(
      promiseFn: Promise<T>,
      messages: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((err: unknown) => string);
      },
    ): Promise<T> => {
      fire("info", messages.loading);
      try {
        const result = await promiseFn;
        const msg =
          typeof messages.success === "function"
            ? messages.success(result)
            : messages.success;
        fire("success", msg);
        return result;
      } catch (err) {
        const msg =
          typeof messages.error === "function"
            ? messages.error(err)
            : messages.error;
        fire("error", msg);
        throw err;
      }
    },
  };
}
