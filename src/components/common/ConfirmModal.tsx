"use client";

import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/src/lib/cn";
import {
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalPanel,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
} from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";
import type { ButtonColor, ButtonVariant } from "@/src/components/ui/button/types";
import type { ModalSize } from "@/src/components/ui/modal/types";

type ConfirmModalVariant = "primary" | "info" | "warning" | "danger" | "success";

const variantIconMap: Record<ConfirmModalVariant, typeof Info> = {
  primary: Info,
  info: Info,
  warning: AlertTriangle,
  danger: XCircle,
  success: CheckCircle,
};

const variantIconStyles: Record<ConfirmModalVariant, string> = {
  primary: "bg-primary-light text-primary dark:bg-primary/10 dark:text-primary",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  warning: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  danger: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  success: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
};

const variantConfirmColor: Record<ConfirmModalVariant, ButtonColor> = {
  primary: "primary",
  info: "primary",
  warning: "primary",
  danger: "danger",
  success: "success",
};

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: ConfirmModalVariant;
  size?: ModalSize;
  title: string;
  description?: string;
  children?: ReactNode;
  icon?: ReactNode;
  iconContainerClassName?: string;
  confirmLabel?: string;
  confirmIcon?: ReactNode;
  cancelLabel?: string;
  confirmColor?: ButtonColor;
  confirmVariant?: ButtonVariant;
  cancelColor?: ButtonColor;
  cancelVariant?: ButtonVariant;
  isLoading?: boolean;
  loadingLabel?: string;
  showCloseButton?: boolean;
  showIcon?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  onCancel,
  variant = "info",
  size = "sm",
  title,
  description,
  children,
  icon,
  iconContainerClassName,
  confirmLabel = "Confirm",
  confirmIcon,
  cancelLabel = "Cancel",
  confirmColor,
  confirmVariant = "solid",
  cancelColor = "secondary",
  cancelVariant = "ghost",
  isLoading = false,
  loadingLabel,
  showCloseButton = true,
  showIcon = true,
}: ConfirmModalProps) {
  const Icon = variantIconMap[variant];
  const resolvedConfirmColor = confirmColor ?? variantConfirmColor[variant];

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size={size}>
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size={size}>
          {showCloseButton && <ModalCloseButton />}

          <ModalContent className="px-4 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              {showIcon && (
                <span
                  className={cn(
                    "inline-flex size-12 items-center justify-center rounded-full",
                    iconContainerClassName ?? variantIconStyles[variant],
                  )}
                >
                  {icon ?? <Icon className="size-6" aria-hidden />}
                </span>
              )}

              <div className="space-y-1.5">
                <ModalTitle className="text-center">{title}</ModalTitle>
                {description && (
                  <ModalDescription className="text-center">
                    {description}
                  </ModalDescription>
                )}
              </div>

              {children}
            </div>
          </ModalContent>

          <ModalFooter className="!flex-row !justify-center gap-3 border-t-0">
            <Button
              type="button"
              color={cancelColor}
              variant={cancelVariant}
              size="md"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              color={resolvedConfirmColor}
              variant={confirmVariant}
              size="md"
              iconStart={confirmIcon}
              onClick={onConfirm}
              isLoading={isLoading}
              loadingLabel={loadingLabel}
            >
              {confirmLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
