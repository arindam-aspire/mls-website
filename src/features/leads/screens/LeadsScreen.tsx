"use client";

import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { LeadList } from "../components/LeadList";
import { useLeadsScreen } from "../hooks/useLeadsScreen";

export function LeadsScreen() {
  const { pageTitle, pageSubtitle, listFilters, leadList } = useLeadsScreen();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>{pageTitle}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
      </div>

      <LeadList filters={listFilters} list={leadList} />
    </div>
  );
}
