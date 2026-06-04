import { cn } from "@/src/lib/cn";

/** Unread dot aligned to top-end of the circular notification control. */
export const notificationsIndicatorBaseClass = cn(
  "pointer-events-none absolute top-1 end-1 size-2.5",
  "rounded-full bg-danger ring-2",
);

export function notificationsIndicatorClass(overHero = false) {
  return cn(
    notificationsIndicatorBaseClass,
    overHero ? "ring-page/90" : "ring-surface",
  );
}
