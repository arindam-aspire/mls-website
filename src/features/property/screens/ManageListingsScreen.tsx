"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { Button } from "@/src/components/ui/button";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isAgentUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

export default function ManageListingsScreen() {
  const t = useTranslations("propertyList.manageListings");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const showAddProperty = useMemo(() => isAgentUser(user), [user]);

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

        {showAddProperty ? (
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
        ) : null}
      </div>

      <ComingSoonCard
        title={t("pageTitle")}
        subtitle={t("comingSoonEyebrow")}
        description={t("comingSoonDescription")}
      />
    </div>
  );
}
