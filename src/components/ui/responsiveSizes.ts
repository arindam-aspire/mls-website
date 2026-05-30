/**
 * Mobile-first sizing for UI controls.
 * Buttons and form fields share the same height scale.
 *
 * Viewport steps (not the component `size` prop):
 * - default (< 640px): compact
 * - sm (≥ 640px): standard
 * - lg (≥ 1024px): roomy
 */
export type UiSizeTier = "sm" | "md" | "lg";

/** Shared outer height — mobile → sm → lg viewport. */
const controlHeightClasses: Record<UiSizeTier, string> = {
  sm: "h-7 sm:h-9 lg:h-10",
  md: "h-8 sm:h-11 lg:h-12",
  lg: "h-9 sm:h-12 lg:h-12",
};

const controlPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2 sm:px-3 lg:px-3.5",
  md: "px-2.5 sm:px-4 lg:px-5",
  lg: "px-3 sm:px-5 lg:px-6",
};

const controlTextClasses: Record<UiSizeTier, string> = {
  sm: "text-[11px] leading-none sm:text-sm sm:leading-normal lg:text-sm",
  md: "text-xs leading-none sm:text-sm sm:leading-normal lg:text-sm",
  lg: "text-xs leading-none sm:text-base sm:leading-normal lg:text-base",
};

const controlGapClasses: Record<UiSizeTier, string> = {
  sm: "gap-1 sm:gap-1.5 lg:gap-1.5",
  md: "gap-1 sm:gap-2 lg:gap-2",
  lg: "gap-1.5 sm:gap-2 lg:gap-2.5",
};

export const buttonSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlPaddingClasses.sm, controlGapClasses.sm, controlTextClasses.sm, "font-medium"),
  md: cnTier(controlHeightClasses.md, controlPaddingClasses.md, controlGapClasses.md, controlTextClasses.md, "font-medium"),
  lg: cnTier(controlHeightClasses.lg, controlPaddingClasses.lg, controlGapClasses.lg, controlTextClasses.lg, "font-medium"),
};

export const buttonIconSizeClasses: Record<UiSizeTier, string> = {
  sm: "size-3 sm:size-3.5 lg:size-3.5",
  md: "size-3 sm:size-4 lg:size-4",
  lg: "size-3.5 sm:size-5 lg:size-5",
};

/** Square buttons — side length matches shared control height. */
export const iconButtonSizeClasses: Record<UiSizeTier, string> = {
  sm: "size-7 shrink-0 !p-0 sm:size-9 lg:size-10",
  md: "size-8 shrink-0 !p-0 sm:size-11 lg:size-12",
  lg: "size-9 shrink-0 !p-0 sm:size-12 lg:size-12",
};

export const fieldControlSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlPaddingClasses.sm, controlGapClasses.sm, controlTextClasses.sm),
  md: cnTier(controlHeightClasses.md, controlPaddingClasses.md, controlGapClasses.md, controlTextClasses.md),
  lg: cnTier(controlHeightClasses.lg, controlPaddingClasses.lg, controlGapClasses.lg, controlTextClasses.lg),
};

export const fieldIconSizeClasses = buttonIconSizeClasses;

/** Same height as fields; extra end padding for chevron. */
export const selectTriggerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    "px-2 pe-7 sm:px-3 sm:pe-9 lg:pe-10",
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    "px-2.5 pe-8 sm:px-4 sm:pe-10 lg:pe-11",
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    "px-3 pe-9 sm:px-5 sm:pe-11 lg:pe-12",
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const textareaSizeClasses: Record<UiSizeTier, string> = {
  sm: "min-h-[3.25rem] px-2 py-1.5 text-[11px] sm:min-h-[4.5rem] sm:px-3 sm:py-2 sm:text-sm lg:min-h-[5rem] lg:px-3.5 lg:py-2",
  md: "min-h-[3.75rem] px-2.5 py-1.5 text-xs sm:min-h-[5.5rem] sm:px-4 sm:py-2.5 sm:text-sm lg:min-h-[6rem] lg:px-5 lg:py-3",
  lg: "min-h-[4.25rem] px-3 py-2 text-xs sm:min-h-[6.5rem] sm:px-5 sm:py-3 sm:text-base lg:min-h-[7rem] lg:px-6 lg:py-3.5",
};

export const toggleContainerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, "p-px sm:p-0.5 lg:p-0.5"),
  md: cnTier(controlHeightClasses.md, "p-px sm:p-1 lg:p-1"),
  lg: cnTier(controlHeightClasses.lg, "p-px sm:p-1 lg:p-1"),
};

export const toggleSegmentSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier("h-full min-h-0", controlPaddingClasses.sm, controlGapClasses.sm, controlTextClasses.sm, "font-medium"),
  md: cnTier("h-full min-h-0", controlPaddingClasses.md, controlGapClasses.md, controlTextClasses.md, "font-medium"),
  lg: cnTier("h-full min-h-0", controlPaddingClasses.lg, controlGapClasses.lg, controlTextClasses.lg, "font-medium"),
};

export const toggleIconSizeClasses = buttonIconSizeClasses;

export const linkSizeClasses: Record<UiSizeTier, string> = {
  sm: "gap-0.5 text-[11px] sm:gap-1 sm:text-sm lg:gap-1.5",
  md: "gap-1 text-xs sm:gap-1.5 sm:text-sm lg:gap-2",
  lg: "gap-1.5 text-xs sm:gap-2 sm:text-base lg:gap-2.5",
};

export const linkIconSizeClasses = buttonIconSizeClasses;

export const budgetShellSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlTextClasses.sm),
  md: cnTier(controlHeightClasses.md, controlTextClasses.md),
  lg: cnTier(controlHeightClasses.lg, controlTextClasses.lg),
};

export const budgetCurrencyPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-1.5 sm:px-2.5 lg:px-3",
  md: "px-2 sm:px-3 lg:px-3.5",
  lg: "px-2.5 sm:px-4 lg:px-5",
};

export const budgetTriggerPaddingClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlGapClasses.sm, "px-1.5 sm:px-2.5 lg:px-3"),
  md: cnTier(controlGapClasses.md, "px-2 sm:px-3 lg:px-3.5"),
  lg: cnTier(controlGapClasses.lg, "px-2.5 sm:px-4 lg:px-5"),
};

export const dropdownPanelSizeClasses =
  "p-1 text-[11px] leading-5 sm:p-2 sm:text-sm lg:p-2.5";

export const dropdownOptionSizeClasses =
  "px-2 py-1 text-[11px] leading-5 sm:px-3 sm:py-1.5 sm:text-sm lg:px-3.5 lg:py-2";

export const selectOptionSizeClasses = dropdownOptionSizeClasses;

export const fieldLabelSizeClasses =
  "mb-1 block text-[11px] font-medium text-text sm:mb-1.5 sm:text-sm lg:mb-2";

export const fieldErrorSizeClasses =
  "mt-1 text-[11px] text-danger sm:mt-1.5 sm:text-sm lg:mt-2";

export const fieldHintSizeClasses =
  "mt-1 text-[11px] text-muted sm:mt-1.5 sm:text-sm lg:mt-2";

export const phoneInputShellSizeClasses = cnTier(
  controlHeightClasses.md,
  controlGapClasses.md,
  controlPaddingClasses.md,
  "rounded-xl",
);

export const phoneInputTextSizeClasses = controlTextClasses.md;

export const phoneInputSearchSizeClasses = cnTier(
  controlHeightClasses.sm,
  "w-full rounded-lg border border-secondary-light bg-page py-0 ps-7 pe-2 sm:ps-9 sm:pe-3 lg:ps-10 lg:pe-3.5",
  controlTextClasses.sm,
);

export const phoneInputListItemSizeClasses = cnTier(
  "flex w-full items-center text-start",
  controlPaddingClasses.sm,
  controlGapClasses.sm,
  controlTextClasses.sm,
);

function cnTier(...classes: string[]) {
  return classes.join(" ");
}
