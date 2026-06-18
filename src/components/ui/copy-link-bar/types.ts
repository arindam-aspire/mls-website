import type { ReactNode } from "react";

export type CopyLinkBarProps = {
  value: string;
  copyLabel: string;
  onCopy: () => void;
  label?: ReactNode;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
};
