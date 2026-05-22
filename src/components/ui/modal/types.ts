import type {
  DialogBackdropProps,
  DialogPanelProps,
  DialogProps,
  DialogTitleProps,
  DescriptionProps,
} from "@headlessui/react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export const MODAL_SIZES = ["sm", "md", "lg", "xl"] as const;

export type ModalSize = (typeof MODAL_SIZES)[number];

export interface ModalProps extends DialogProps {
  children: ReactNode;
  /** Default panel width when `ModalPanel` omits `size`. */
  size?: ModalSize;
}

export interface ModalBackdropProps extends DialogBackdropProps {}

export interface ModalContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalPanelProps extends DialogPanelProps {
  children: ReactNode;
  /** Overrides `size` from the parent `Modal`. */
  size?: ModalSize;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalTitleProps extends DialogTitleProps {
  children: ReactNode;
}

export interface ModalDescriptionProps extends DescriptionProps {
  children: ReactNode;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalCloseButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
}

export interface ModalBackButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label"?: string;
}
