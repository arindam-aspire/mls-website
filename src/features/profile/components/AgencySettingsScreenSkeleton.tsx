import { Skeleton } from "@/src/components/ui/skeleton";
import { AgencyDisplayPreferenceCardSkeleton } from "./AgencyDisplayPreferenceCard";

export function AgencySettingsScreenSkeleton() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 md:gap-6" aria-hidden>
      <div className="min-w-0 space-y-2">
        <Skeleton variant="text" className="h-8 w-48 max-w-full sm:h-9 sm:w-56" />
        <Skeleton variant="text" className="h-5 w-full max-w-2xl" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        <AgencyDisplayPreferenceCardSkeleton />
        <AgencyDisplayPreferenceCardSkeleton />
      </div>
    </div>
  );
}
