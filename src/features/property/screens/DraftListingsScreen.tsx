"use client";

import { useDraftListingsScreen } from "@/src/features/property/hooks/useDraftListingsScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { DraftList } from "@abdoun/abdoun-library";
import { useTranslations } from "next-intl";

export default function DraftListingsScreen() {
  const t = useTranslations("propertyList.draftListings");
  const {
    draftListItems,
    isLoading,
    pagination,
    onCreateNew,
    onDelete,
    onResume,
    resumeLabel,
    createLabel,
    emptyStateContent,
  } = useDraftListingsScreen();

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>
          {t("pageTitle")}
        </h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>
          {t("pageSubtitle")}
        </p>
      </div>

      <DraftList
        items={draftListItems}
        isLoading={isLoading}
        onCreateNew={onCreateNew}
        onDelete={onDelete}
        onResume={onResume}
        pagination={pagination}
        resumeLabel={resumeLabel}
        createLabel={createLabel}
        emptyStateContent={emptyStateContent}
        size="md"
      />
    </div>
  );
}
