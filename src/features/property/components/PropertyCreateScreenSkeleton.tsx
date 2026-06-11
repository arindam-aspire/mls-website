import { Skeleton } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

const headerRowClassName =
  "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6";

const formShellClassName =
  "w-full min-w-0 rounded-xl border border-secondary/15 bg-surface";

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

      <div className={cn(formShellClassName, "flex flex-col lg:flex-row")}>
        <aside className="hidden w-full max-w-xs shrink-0 border-b border-secondary/15 p-4 lg:block lg:border-b-0 lg:border-e">
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton variant="block" className="size-8 rounded-lg" />
                <Skeleton variant="text" className="h-4 w-28" />
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-4 flex gap-2 overflow-hidden lg:hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="block" className="h-9 w-20 shrink-0 rounded-lg" />
            ))}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Skeleton variant="text" className="h-6 w-40 sm:w-48" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton variant="block" className="h-11 w-full rounded-lg" />
              <Skeleton variant="block" className="h-11 w-full rounded-lg" />
              <Skeleton variant="block" className="h-11 w-full rounded-lg md:col-span-2" />
              <Skeleton variant="block" className="h-28 w-full rounded-lg md:col-span-2" />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Skeleton variant="block" className="h-11 w-full rounded-lg sm:w-28" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton variant="block" className="h-11 w-full rounded-lg sm:w-28" />
              <Skeleton variant="block" className="h-11 w-full rounded-lg sm:w-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
