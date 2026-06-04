import { Skeleton } from "@/src/components/ui/skeleton";

export function ProfilePageToolbarSkeleton() {
  return (
    <div
      className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6"
      aria-hidden
    >
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton variant="text" className="h-8 w-48 max-w-full sm:h-9 sm:w-56" />
        <Skeleton variant="text" className="h-5 w-full max-w-md sm:h-6" />
      </div>

      <Skeleton className="h-9 w-full shrink-0 rounded-lg sm:h-10 sm:w-44" />
    </div>
  );
}
