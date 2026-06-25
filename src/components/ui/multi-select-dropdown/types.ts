import type { FocusEvent, ReactNode } from "react";
import type {
  SelectDropdownOption,
  SelectDropdownSize,
  SelectDropdownVariant,
} from "../select-dropdown/types";

export type MultiSelectDropdownOption = SelectDropdownOption;

export interface MultiSelectDropdownProps {
  options: MultiSelectDropdownOption[];
  variant?: SelectDropdownVariant;
  size?: SelectDropdownSize;
  placeholder: string;
  label?: ReactNode;
  labelClassName?: string;
  error?: string;
  hint?: string;
  isRequired?: boolean;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  fullWidth?: boolean;
  wrapperClassName?: string;
  iconStart?: ReactNode;
  iconClassName?: string;
  triggerClassName?: string;
  triggerLabelClassName?: string;
  panelClassName?: string;
  optionClassName?: string;
  className?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  listboxModal?: boolean;
  "aria-label"?: string;
}
