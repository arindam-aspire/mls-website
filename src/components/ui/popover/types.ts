import type {
  PopoverBackdropProps,
  PopoverButtonProps,
  PopoverGroupProps,
  PopoverPanelProps,
  PopoverProps,
} from "@headlessui/react";
import type { HTMLAttributes, ReactNode } from "react";

export interface PopoverRootProps extends PopoverProps {
  children: ReactNode;
}

export interface PopoverTriggerProps extends PopoverButtonProps {
  children: ReactNode;
}

export interface PopoverBackdropWrapperProps extends PopoverBackdropProps {}

export interface PopoverPanelWrapperProps extends PopoverPanelProps {
  children: ReactNode;
  /** Full-viewport panel with modal behavior (no floating anchor). */
  fullScreen?: boolean;
}

export interface PopoverGroupWrapperProps extends PopoverGroupProps {
  children: ReactNode;
}

export interface PopoverHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
