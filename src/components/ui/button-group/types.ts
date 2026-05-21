import type { MouseEventHandler, ReactNode } from "react";
import type { ButtonColor, ButtonSize, ButtonVariant } from "../button/types";

export const BUTTON_GROUP_ORIENTATIONS = ["horizontal", "vertical"] as const;

export type ButtonGroupOrientation =
  (typeof BUTTON_GROUP_ORIENTATIONS)[number];

export const BUTTON_GROUP_ROUNDED = ["default", "top-only"] as const;

export type ButtonGroupRounded = (typeof BUTTON_GROUP_ROUNDED)[number];

export type ButtonGroupItem<T extends string = string> = {
  value: T;
  label: ReactNode;
  disabled?: boolean;
  /** Runs after the group updates selection (if applicable). */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonGroupSharedProps<T extends string> = {
  items: ButtonGroupItem<T>[];
  color?: ButtonColor;
  /** Variant for unselected segments when not using custom class names. */
  variant?: ButtonVariant;
  /** Variant for the selected segment when not using custom class names. Defaults to `solid`. */
  selectedVariant?: ButtonVariant;
  /** Variant for unselected segments when using custom class names. Defaults to `ghost`. */
  unselectedVariant?: ButtonVariant;
  size?: ButtonSize;
  orientation?: ButtonGroupOrientation;
  rounded?: ButtonGroupRounded;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  selectedClassName?: string;
  unselectedClassName?: string;
  "aria-label"?: string;
  id?: string;
};

/** Controlled: `value` and `onChange` are required together. */
export type ButtonGroupProps<T extends string = string> =
  ButtonGroupSharedProps<T> &
    (
      | {
          value: T;
          onChange: (value: T) => void;
          defaultValue?: never;
        }
      | {
          value?: never;
          defaultValue?: T;
          onChange?: (value: T) => void;
        }
    );
