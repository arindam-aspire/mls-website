import { Skeleton } from "@/src/components/ui/skeleton";

function SelectAgencyListItemSkeleton() {
  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border border-secondary/15 bg-surface p-2 sm:items-center sm:gap-3"
      aria-hidden
    >
      <Skeleton
        variant="circular"
        className="size-14 shrink-0 bg-secondary/10 dark:bg-secondary-light/40"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-2/5 max-w-[10rem]" />
        <Skeleton variant="text" className="h-3 w-3/5 max-w-[14rem]" />
        <div className="flex flex-col gap-1.5 pt-0.5 sm:flex-row sm:gap-3">
          <Skeleton variant="text" className="h-3 w-1/2 max-w-[11rem]" />
          <Skeleton variant="text" className="h-3 w-2/5 max-w-[9rem]" />
        </div>
      </div>
      <Skeleton variant="circular" className="size-5 shrink-0" />
    </div>
  );
}

export function SelectAgencyModalSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <Skeleton variant="block" className="h-11 w-full rounded-lg" />
      <Skeleton variant="text" className="h-3 w-24" />
      {Array.from({ length: 4 }).map((_, index) => (
        <SelectAgencyListItemSkeleton key={`select-agency-skeleton-${index}`} />
      ))}
    </div>
  );
}
