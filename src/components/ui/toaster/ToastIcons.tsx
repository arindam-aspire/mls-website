import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import type { ToastVariant } from "./types";

const iconMap: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastIcon({ variant }: { variant: ToastVariant }) {
  const Icon = iconMap[variant];
  return <Icon className="size-4" aria-hidden />;
}

export function CloseIcon() {
  return <X className="size-3.5" aria-hidden />;
}
