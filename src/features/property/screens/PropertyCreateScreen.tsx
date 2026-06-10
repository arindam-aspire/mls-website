"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { Breadcrumb } from "@/src/components/ui/breadcrumb";
import { PropertyCreateScreenSkeleton } from "@/src/features/property/components/PropertyCreateScreenSkeleton";
import { usePropertyCreateScreen } from "@/src/features/property/hooks/usePropertyCreateScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";

export default function PropertyCreateScreen() {
  const {
    pageTitle,
    pageSubtitle,
    comingSoonEyebrow,
    comingSoonDescription,
    breadcrumbItems,
    breadcrumbAriaLabel,
    isCatalogLoading,
  } = usePropertyCreateScreen();

  if (isCatalogLoading) {
    return <PropertyCreateScreenSkeleton />;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className={headingPageClasses}>{pageTitle}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
        </div>

        <Breadcrumb
          items={breadcrumbItems}
          ariaLabel={breadcrumbAriaLabel}
          className="hidden shrink-0 md:flex"
        />
      </div>

      <ComingSoonCard
        title={pageTitle}
        subtitle={comingSoonEyebrow}
        description={comingSoonDescription}
      />
    </div>
  );
}
