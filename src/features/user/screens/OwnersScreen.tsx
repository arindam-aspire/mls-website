"use client";

import { OwnerList } from "@/src/features/user/components/OwnerList";
import { useOwnersScreen } from "@/src/features/user/hooks/useOwnersScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export function OwnersScreen() {
  const { pageTitle, pageSubtitle, listFilters, ownerList } = useOwnersScreen();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>{pageTitle}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
      </div>

      <OwnerList filters={listFilters} list={ownerList} />
    </div>
  );
}
