"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { buildHeaderLocaleOptions } from "@/src/layouts/shared/buildHeaderLocaleOptions";
import { HeaderFullscreenButton } from "@/src/layouts/shared/HeaderFullscreenButton";
import { HeaderLanguageSelect } from "@/src/layouts/shared/HeaderLanguageSelect";
import {
  headerControlDividerClass,
  headerIconButtonSizeClass,
} from "@/src/layouts/shared/headerIconButtonStyles";
import { cn } from "@/src/lib/cn";
import { ProfilePopover } from "./ProfilePopover";
import { PublicHeaderThemeButton } from "./PublicHeaderThemeButton";

export function DesktopActions() {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoadingUser } = useAuthStore();
  const openAuth = useAuthStore((state) => state.openAuth);

  const localeOptions = useMemo(() => buildHeaderLocaleOptions(t), [t]);

  const openChooseAccount = () => {
    openAuth(AUTH_VIEW.chooseAccount);
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="col-start-3 hidden items-center gap-2 justify-self-end sm:gap-3 md:flex">
      <PublicHeaderThemeButton />
      <HeaderFullscreenButton />

      <HeaderLanguageSelect
        value={locale}
        options={localeOptions}
        onChange={handleLocaleChange}
        ariaLabel={t("language")}
        className="relative z-[60]"
      />

      {isLoadingUser ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Skeleton
            variant="circular"
            className={cn(headerIconButtonSizeClass, "shrink-0")}
          />
          <Skeleton
            variant="circular"
            className={cn(headerIconButtonSizeClass, "shrink-0")}
          />
          <Skeleton className="h-8 w-14 shrink-0 rounded-lg sm:h-9 lg:h-10" aria-hidden />
          <span className={cn(headerControlDividerClass, "hidden md:block")} aria-hidden />
          <Skeleton className="hidden h-8 w-24 rounded-lg sm:h-9 md:block lg:h-10" />
          <Skeleton
            variant="circular"
            className={cn(headerIconButtonSizeClass, "shrink-0")}
          />
        </div>
      ) : user ? (
        <ProfilePopover user={user} />
      ) : (
        <Button
          type="button"
          color="primary"
          variant="solid"
          size="sm"
          className="shrink-0"
          onClick={openChooseAccount}
        >
          {t("signInSignUp")}
        </Button>
      )}
    </div>
  );
}
