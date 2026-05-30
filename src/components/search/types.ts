export interface BudgetRangeInputsProps {
  minBudget: string;
  maxBudget: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
  onDone: () => void;
  onReset: () => void;
  minLabel?: string;
  maxLabel?: string;
  maxPlaceholder?: string;
  suggestions?: readonly string[];
  variant?: "dropdown" | "sheet";
}

export interface BudgetFieldProps {
  min: string;
  max: string;
  onChangeMin: (value: string) => void;
  onChangeMax: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onCommit: () => void;
  onReset: () => void;
  placeholder?: string;
  currencyCode?: string;
  isRtl?: boolean;
  rentMode?: boolean;
  minFallbackLabel?: string;
  maxFallbackLabel?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}
