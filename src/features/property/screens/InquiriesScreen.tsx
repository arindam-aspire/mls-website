"use client";

import { useTranslations } from "next-intl";
import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isOwnerUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import LoadingScreen from "@/src/features/loading/screens";
import { LeadList } from "@/src/features/leads/components/LeadList";
import { useLeadsScreen } from "@/src/features/leads/hooks/useLeadsScreen";

function OwnerInquiriesList() {
  const { pageTitle, pageSubtitle, listFilters, leadList } = useLeadsScreen({
    scope: "owner",
  });

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 px-4 py-4 sm:px-6 md:gap-4 md:py-6 lg:gap-6">
      <div className="min-w-0 flex-1">
        <h1 className={headingPageClasses}>{pageTitle}</h1>
        <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
      </div>

      <LeadList filters={listFilters} list={leadList} />
    </div>
  );
}

export default function InquiriesScreen() {
  const t = useTranslations("leads.ownerList");
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  if (isLoadingUser || !user) {
    return <LoadingScreen />;
  }

  if (isOwnerUser(user)) {
    return <OwnerInquiriesList />;
  }

  return (
    <ComingSoonCard
      title={t("tableTitle")}
      subtitle={t("comingSoonSubtitle")}
      description={t("comingSoonDescription")}
    />
  );
}
