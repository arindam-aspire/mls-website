"use client";

import type { ReactNode } from "react";
import { ToastProvider as ToastStateProvider } from "@/src/hooks/useToast";
import { Toaster } from "@/src/components/ui/toaster";
import type { ToastPosition, ToastStyle } from "@/src/types/toast.types";

export interface AppToastProviderProps {
  children: ReactNode;
  duration?: number;
  position?: ToastPosition;
  styleVariant?: ToastStyle;
}

export default function ToastProvider({
  children,
  duration = 4000,
  position = "top-right",
  styleVariant = "outline",
}: AppToastProviderProps) {
  return (
    <ToastStateProvider duration={duration}>
      {children}
      <Toaster position={position} styleVariant={styleVariant} />
    </ToastStateProvider>
  );
}
