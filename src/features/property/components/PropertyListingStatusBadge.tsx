import type { PropertyListingStatus } from "@abdoun/abdoun-library";
import { cn } from "@/src/lib/cn";
import { getPropertyListingStatusBadgeClassName } from "@/src/features/property/utils/propertyListingStatusBadgeColors";

type PropertyListingStatusBadgeProps = {
  status: PropertyListingStatus;
};

const BADGE_BASE_CLASSNAME =
  "inline-flex w-fit max-w-max shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm sm:px-3 sm:text-xs";

export function PropertyListingStatusBadge({
  status,
}: PropertyListingStatusBadgeProps) {
  return (
    <span
      className={cn(
        BADGE_BASE_CLASSNAME,
        getPropertyListingStatusBadgeClassName(status.key),
      )}
    >
      {status.label}
    </span>
  );
}
