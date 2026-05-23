export type ToastVariant = "success" | "error" | "warning" | "info";
export type ToastStyle = "soft" | "solid" | "outline";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
}
