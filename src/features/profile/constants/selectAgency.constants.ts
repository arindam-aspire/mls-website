import { cn } from "@/src/lib/cn";

export const DEFAULT_AGENCY_LIST_SKIP = 0;
export const DEFAULT_AGENCY_LIST_LIMIT = 50;

/** Agency logo fallback when the row is not selected. */
export const selectAgencyAvatarClassName = cn(
  "!bg-secondary/10 !text-secondary-dark",
  "dark:!bg-secondary-light/40 dark:!text-secondary",
  "focus-visible:!ring-secondary/40",
);

/** Agency logo fallback when the row is selected. */
export const selectAgencyAvatarSelectedClassName = cn(
  "!bg-primary/10 !text-primary-dark",
  "dark:!bg-primary/15 dark:!text-primary",
  "focus-visible:!ring-primary/40",
  "ring-primary/30",
);
