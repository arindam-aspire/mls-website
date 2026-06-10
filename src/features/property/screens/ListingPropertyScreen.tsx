"use client";

import { Button, Card, CardContent } from "@/src/components/ui";
import { MyListingFilters } from "@/src/features/property/components/MyListingFilters";
import { useListingPropertyScreen } from "@/src/features/property/hooks/useListingPropertyScreen";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

const listingsCardClassName =
  "w-full min-w-0 rounded-xl border border-secondary/15 shadow-none";

export default function ListingPropertyScreen() {
  const { filters } = useListingPropertyScreen();
  const t = useTranslations("propertyList.myListings");
  const router = useRouter();

  const onAddProperty = useCallback(() => {
    router.push("/property-create");
  }, [router]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className={headingPageClasses}>{t("pageTitle")}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{t("pageSubtitle")}</p>
        </div>

        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          className="w-full shrink-0 rounded-lg sm:w-auto"
          iconStart={<Plus className="size-4" aria-hidden />}
          onClick={onAddProperty}
        >
          {t("addProperty")}
        </Button>
      </div>

      <Card className={listingsCardClassName}>
        <CardContent className="p-4 sm:p-6">
          <MyListingFilters {...filters} />
        </CardContent>
      </Card>
    </div>
  );
}
