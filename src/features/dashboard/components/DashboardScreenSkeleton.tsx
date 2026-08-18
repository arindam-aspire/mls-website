import { Card, CardContent, Skeleton } from "@/src/components/ui";

export function DashboardScreenSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <Card className="rounded-xl border border-secondary/10 shadow-none">
        <CardContent className="p-4 sm:p-6">
          <Skeleton variant="text" className="h-7 w-40" />
          <Skeleton variant="text" className="mt-3 w-full max-w-xl" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }, (_, index) => (
          <Card
            key={index}
            className="rounded-xl border border-secondary/10 shadow-none"
          >
            <CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5">
              <div className="w-2/3">
                <Skeleton variant="text" className="w-4/5" />
                <Skeleton variant="text" className="mt-3 h-8 w-2/3" />
                <Skeleton variant="text" className="mt-3 h-3 w-1/2" />
              </div>
              <Skeleton className="size-11 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <Card
            key={index}
            className="rounded-xl border border-secondary/10 shadow-none"
          >
            <CardContent className="p-4 sm:p-6">
              <Skeleton variant="text" className="h-6 w-36" />
              <Skeleton className="mt-5 h-56 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card
            key={index}
            className="rounded-xl border border-secondary/10 shadow-none"
          >
            <CardContent className="p-4 sm:p-6">
              <Skeleton variant="text" className="h-6 w-36" />
              <Skeleton className="mt-5 h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
