import {
  controlTextClasses,
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
  textDropdownOptionClasses,
  textDropdownPanelClasses,
} from "@/src/lib/typography";

/**
 * Mobile-first sizing for UI controls.
 * Buttons and form fields share the same height scale.
 * Default: moderate mobile scale. From `sm` up: full scale; from `lg` up: slightly roomier.
 */
export type UiSizeTier = "sm" | "md" | "lg";

/** Button-only tier below `sm` for compact actions. */
export type ButtonSizeTier = "xs" | UiSizeTier;

/** Shared outer height for buttons, inputs, selects, toggles (mobile → sm+ → lg+). */
const controlHeightClasses: Record<UiSizeTier, string> = {
  sm: "h-8 sm:h-9 lg:h-10",
  md: "h-9 sm:h-11 lg:h-12",
  lg: "h-10 sm:h-12 lg:h-12",
};

const controlPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2.5 sm:px-3 lg:px-4",
  md: "px-3 sm:px-4 lg:px-5",
  lg: "px-4 sm:px-5 lg:px-6",
};

const controlGapClasses: Record<UiSizeTier, string> = {
  sm: "gap-1 sm:gap-1.5 lg:gap-2",
  md: "gap-1.5 sm:gap-2 lg:gap-2",
  lg: "gap-2 lg:gap-2.5",
};

export const buttonSizeClasses: Record<ButtonSizeTier, string> = {
  xs: cnTier("h-7 px-2 gap-1 text-xs font-medium"),
  sm: cnTier(
    controlHeightClasses.sm,
    controlPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    controlPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    controlPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const buttonIconSizeClasses: Record<ButtonSizeTier, string> = {
  xs: "size-3",
  sm: "size-3 sm:size-3.5 lg:size-4",
  md: "size-3.5 sm:size-4 lg:size-5",
  lg: "size-4 sm:size-5 lg:size-5",
};

/** Glyph scale inside `IconButton` (alias of `buttonIconSizeClasses`). */
export const iconButtonIconSizeClasses = buttonIconSizeClasses;

/** Square buttons — side length matches shared control height. */
export const iconButtonSizeClasses: Record<ButtonSizeTier, string> = {
  xs: "size-7 shrink-0 !p-0",
  sm: "size-8 shrink-0 !p-0 sm:size-9 lg:size-10",
  md: "size-9 shrink-0 !p-0 sm:size-11 lg:size-12",
  lg: "size-10 shrink-0 !p-0 sm:size-12 lg:size-12",
};

export const fieldControlSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    controlPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
  ),
  md: cnTier(
    controlHeightClasses.md,
    controlPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    controlPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
  ),
};

export const fieldIconSizeClasses = buttonIconSizeClasses;

/** Start padding when a leading icon is placed before the trigger (e.g. sort filter). */
export const selectTriggerLeadingIconPaddingClasses: Record<UiSizeTier, string> = {
  sm: "ps-8 sm:ps-9 lg:ps-10",
  md: "ps-9 sm:ps-10 lg:ps-11",
  lg: "ps-10 sm:ps-11 lg:ps-12",
};

/** Position classes for an absolutely placed leading icon beside the trigger. */
export const selectLeadingIconPositionClasses: Record<UiSizeTier, string> = {
  sm: "start-2 top-1/2 size-3 -translate-y-1/2 sm:start-2.5 sm:size-3.5 lg:size-4",
  md: "start-2.5 top-1/2 size-3.5 -translate-y-1/2 sm:start-3 sm:size-4",
  lg: "start-3 top-1/2 size-3.5 -translate-y-1/2 sm:size-4 lg:size-4",
};

export const selectTriggerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    controlHeightClasses.sm,
    "px-2.5 pe-8 sm:px-3 sm:pe-9 lg:px-4 lg:pe-10",
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    controlHeightClasses.md,
    "px-3 pe-9 sm:px-4 sm:pe-10 lg:px-5 lg:pe-11",
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    controlHeightClasses.lg,
    "px-4 pe-10 sm:px-5 sm:pe-11 lg:px-6 lg:pe-12",
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const textareaSizeClasses: Record<UiSizeTier, string> = {
  sm: "min-h-[3.75rem] px-2.5 py-1.5 text-xs sm:min-h-[4.5rem] sm:px-3 sm:py-2 sm:text-sm",
  md: "min-h-[4.25rem] px-3 py-2 text-xs sm:min-h-[5.5rem] sm:px-4 sm:py-2.5 sm:text-sm lg:text-base",
  lg: "min-h-[4.75rem] px-4 py-2 text-sm sm:min-h-[6.5rem] sm:px-5 sm:py-3 sm:text-base",
};

/** Inset padding between the toggle shell border and segment track. */
const toggleInsetPaddingClasses: Record<UiSizeTier, string> = {
  sm: "p-0.5 sm:p-1",
  md: "p-0.5 sm:p-1",
  lg: "p-1 sm:p-1",
};

/** Extra inset for bordered variants (`solid` / `outline`) so the slide clears the shell border. */
const toggleBorderedTrackInsetPaddingClasses: Record<UiSizeTier, string> = {
  sm: "p-1",
  md: "p-1",
  lg: "p-1 sm:p-1.5",
};

/** Horizontal padding inside each toggle segment (tighter than standalone buttons). */
const toggleSegmentPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2 sm:px-3",
  md: "px-2.5 sm:px-3",
  lg: "px-3 sm:px-4",
};

/** Outer shell height (border + background); padding lives on the inner track. */
export const toggleShellSizeClasses: Record<UiSizeTier, string> = {
  sm: controlHeightClasses.sm,
  md: controlHeightClasses.md,
  lg: controlHeightClasses.lg,
};

export const toggleTrackInsetClasses: Record<UiSizeTier, string> =
  toggleInsetPaddingClasses;

export const toggleBorderedTrackInsetClasses =
  toggleBorderedTrackInsetPaddingClasses;

/** @deprecated Prefer `toggleShellSizeClasses` + `toggleTrackInsetClasses`. */
export const toggleContainerSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, toggleInsetPaddingClasses.sm),
  md: cnTier(controlHeightClasses.md, toggleInsetPaddingClasses.md),
  lg: cnTier(controlHeightClasses.lg, toggleInsetPaddingClasses.lg),
};

export const toggleSegmentSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(
    "min-h-0 flex-1 self-stretch py-0",
    toggleSegmentPaddingClasses.sm,
    controlGapClasses.sm,
    controlTextClasses.sm,
    "font-medium",
  ),
  md: cnTier(
    "min-h-0 flex-1 self-stretch py-0",
    toggleSegmentPaddingClasses.md,
    controlGapClasses.md,
    controlTextClasses.md,
    "font-medium",
  ),
  lg: cnTier(
    "min-h-0 flex-1 self-stretch py-0",
    toggleSegmentPaddingClasses.lg,
    controlGapClasses.lg,
    controlTextClasses.lg,
    "font-medium",
  ),
};

export const toggleIconSizeClasses = buttonIconSizeClasses;

/** Hero image carousel bar (PropertyView). */
export const heroCarouselShellSizeClasses = cnTier(
  "flex min-w-0 items-center justify-between rounded-full",
  controlHeightClasses.md,
  controlPaddingClasses.md,
  controlGapClasses.md,
);

/** Prev / next / pause controls inside the carousel bar. */
export const heroCarouselControlButtonSizeClasses = iconButtonSizeClasses.sm;

export const heroCarouselControlIconSizeClasses = buttonIconSizeClasses.sm;

export const linkSizeClasses: Record<UiSizeTier, string> = {
  sm: "gap-0.5 text-xs sm:gap-1 sm:text-sm",
  md: "gap-1 text-xs sm:gap-1.5 sm:text-sm lg:text-base",
  lg: "gap-1.5 text-sm sm:gap-2 sm:text-base",
};

export const linkIconSizeClasses = buttonIconSizeClasses;

export const budgetShellSizeClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlHeightClasses.sm, controlTextClasses.sm),
  md: cnTier(controlHeightClasses.md, controlTextClasses.md),
  lg: cnTier(controlHeightClasses.lg, controlTextClasses.lg),
};

export const budgetCurrencyPaddingClasses: Record<UiSizeTier, string> = {
  sm: "px-2 sm:px-2.5 lg:px-3",
  md: "px-2.5 sm:px-3 lg:px-4",
  lg: "px-3 sm:px-4 lg:px-5",
};

export const budgetTriggerPaddingClasses: Record<UiSizeTier, string> = {
  sm: cnTier(controlGapClasses.sm, "px-2 sm:px-2.5 lg:px-3"),
  md: cnTier(controlGapClasses.md, "px-2.5 sm:px-3 lg:px-4"),
  lg: cnTier(controlGapClasses.lg, "px-3 sm:px-4 lg:px-5"),
};

export const dropdownPanelSizeClasses = cnTier(
  "p-1.5 sm:p-2 lg:p-2.5",
  textDropdownPanelClasses,
);

export const dropdownOptionSizeClasses = cnTier(
  "px-2.5 py-1 sm:px-3 sm:py-1.5 lg:px-3.5 lg:py-2",
  textDropdownOptionClasses,
);

export const selectOptionSizeClasses = dropdownOptionSizeClasses;

export {
  fieldErrorSizeClasses,
  fieldHintSizeClasses,
  fieldLabelSizeClasses,
} from "@/src/lib/typography";

export const phoneInputShellSizeClasses = cnTier(
  controlHeightClasses.md,
  "overflow-hidden rounded-xl",
);

export const phoneInputTrackClasses = cnTier(
  "flex h-full min-h-0 w-full items-stretch gap-2 p-1",
);

export const phoneInputCountrySegmentSolidClasses = cnTier(
  "flex shrink-0 items-center self-stretch px-2 sm:px-2.5",
  controlGapClasses.sm,
);

export const phoneInputCountrySegmentGhostClasses = cnTier(
  "flex shrink-0 items-center self-stretch px-0.5 sm:px-1",
  controlGapClasses.sm,
);

export const phoneInputDividerClasses =
  "w-px shrink-0 self-stretch bg-secondary/15";

export const phoneInputFieldPaddingClasses = "px-1 sm:px-2";

export const phoneInputTextSizeClasses = controlTextClasses.md;

export const phoneInputSearchSizeClasses = cnTier(
  controlHeightClasses.sm,
  "w-full rounded-lg border border-secondary-light bg-page py-0 ps-8 pe-2.5 sm:ps-9 sm:pe-3 lg:ps-10 lg:pe-4",
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
