import { Skeleton } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

const headerRowClassName =
  "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6";

const cardClassName =
  "w-full min-w-0 rounded-xl border border-secondary/15 bg-surface p-6 sm:p-8 md:p-10";

export function PropertyCreateScreenSkeleton() {
  return (
    <div
      className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6"
      aria-busy="true"
      aria-hidden
    >
      <div className={headerRowClassName}>
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton variant="text" className="h-7 w-48 sm:h-8 md:w-56" />
          <Skeleton variant="text" className="h-5 w-full max-w-xl" />
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Skeleton variant="block" className="size-9 rounded-lg" />
          <Skeleton variant="text" className="h-4 w-24" />
          <Skeleton variant="text" className="h-4 w-16" />
        </div>
      </div>

      <div className={cn(cardClassName, "flex flex-col items-center gap-4 text-center")}>
        <Skeleton variant="block" className="size-14 rounded-xl sm:size-16" />
        <Skeleton variant="text" className="h-6 w-40 sm:w-48" />
        <Skeleton variant="text" className="h-4 w-full max-w-md" />
        <Skeleton variant="text" className="h-4 w-full max-w-sm" />
      </div>
    </div>
  );
}
