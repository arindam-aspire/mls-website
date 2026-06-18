import {
  buttonIconSizeClasses,
  iconButtonSizeClasses,
} from "@/src/components/ui/responsiveSizes";

/** Header chrome uses the compact `sm` control tier (see `responsiveSizes`). */
export const headerIconButtonSizeClass = iconButtonSizeClasses.sm;

/** Thin outline stroke for header utility icons. */
export const headerIconStrokeWidth = 1.75;

export const headerIconGlyphClass = cnIcon(
  buttonIconSizeClasses.sm,
  "shrink-0 text-current",
);

/** Rounded outline icon control — circular border, surface fill, muted icon. */
export const headerIconButtonClass = cnIcon(
  "inline-flex shrink-0 items-center justify-center !gap-0 !rounded-full !border !border-secondary/15 !bg-surface !p-0 !shadow-none",
  "!text-muted transition-colors hover:!bg-page hover:!text-text data-active:!bg-page data-active:!text-text",
  "focus-visible:ring-2 focus-visible:ring-secondary/40",
  headerIconButtonSizeClass,
);

export const headerControlDividerClass =
  "h-8 w-px shrink-0 bg-secondary/15 sm:h-9 lg:h-10";

export const headerPopoverTriggerClass = headerIconButtonClass;

export const headerNotificationCountBadgeClass = cnIcon(
  "pointer-events-none absolute -top-1 end-0 flex min-w-[1.125rem] items-center justify-center",
  "rounded-full bg-danger px-1 py-px text-[10px] font-semibold leading-none text-white ring-2 ring-surface",
);

function cnIcon(...classes: string[]) {
  return classes.join(" ");
}
