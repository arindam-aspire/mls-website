import type { ReactNode } from "react";
import type { ButtonProps } from "../button/types";

export interface IconButtonProps
  extends Omit<ButtonProps, "children" | "iconStart" | "iconEnd"> {
  icon: ReactNode;
  "aria-label": string;
}
