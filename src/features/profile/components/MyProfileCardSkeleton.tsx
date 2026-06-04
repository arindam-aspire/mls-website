import { Card, CardContent } from "@/src/components/ui";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/cn";
const profileCardClassName = "w-full max-w-md md:mx-auto lg:mx-0";

function ProfileFieldSkeleton({
  showBadge,
  showEdit,
}: {
  showBadge?: boolean;
  showEdit?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Skeleton className="size-10 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton variant="text" className="h-3 w-20" />
        <Skeleton variant="text" className="h-4 w-full max-w-[14rem]" />
        {showBadge ? (
          <Skeleton variant="text" className="h-6 w-24 rounded-lg" />
        ) : null}
      </div>
      {showEdit ? (
        <Skeleton className="mt-0.5 size-9 shrink-0 rounded-lg" />
      ) : null}
    </div>
  );
}

export function MyProfileCardSkeleton() {
  return (
    <div className="flex w-full justify-center" aria-hidden>
      <Card className={profileCardClassName}>
        <CardContent className="p-4 sm:p-6">
        <div className="flex w-full flex-col items-center gap-3">
          <Skeleton
            variant="circular"
            className="size-28 shrink-0 border-2 border-secondary/15 sm:size-32"
          />
          <Skeleton variant="text" className="h-4 w-full max-w-xs" />
        </div>

        <Skeleton
          variant="text"
          className={cn(
            "mx-auto mt-6 h-6 w-40 sm:mt-8",
            "md:mx-0 md:ms-0",
          )}
        />

        <div className="mt-3 flex flex-col gap-4 md:mt-4 md:gap-5">
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton showBadge showEdit />
          <ProfileFieldSkeleton showBadge showEdit />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
