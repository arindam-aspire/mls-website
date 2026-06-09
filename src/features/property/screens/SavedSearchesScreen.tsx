"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useSavedSearchesScreen } from "@/src/features/property/hooks/useSavedSearchesScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export default function SavedSearchesScreen() {
  const { pageTitle, pageSubtitle, comingSoonEyebrow, comingSoonDescription } =
    useSavedSearchesScreen();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="min-w-0">
        <h1 className={headingPageClasses}>{pageTitle}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
      </div>

      <ComingSoonCard
        title={pageTitle}
        subtitle={comingSoonEyebrow}
        description={comingSoonDescription}
      />
    </div>
  );
}
