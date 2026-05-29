"use client";

import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { LandingProfilePopover } from "./LandingProfilePopover";
import { LandingHeaderThemeButton } from "./LandingHeaderThemeButton";

const LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

interface LandingDesktopActionsProps {
  overHero: boolean;
}

export function LandingDesktopActions({ overHero }: LandingDesktopActionsProps) {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoadingUser } = useAuthStore();

  const openChooseAccount = () => {
    router.push({ pathname: "/", query: { auth: AUTH_VIEW.chooseAccount } });
  };

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as AppLocale });
  };

  return (
    <div className="col-start-3 hidden items-center gap-3 justify-self-end md:flex">
      <LandingHeaderThemeButton overHero={overHero} />

      <Select
        aria-label={t("language")}
        options={LOCALE_OPTIONS}
        value={locale}
        onChange={handleLocaleChange}
        variant="outline"
        size="md"
        fullWidth={false}
        wrapperClassName="relative z-[60] w-auto min-w-[4.5rem] shrink-0"
        selectClassName={overHero ? "bg-surface/90 backdrop-blur-sm" : undefined}
      />

      {isLoadingUser ? (
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="size-11" />
          <Skeleton variant="circular" className="size-11" />
        </div>
      ) : user ? (
        <LandingProfilePopover user={user} overHero={overHero} />
      ) : (
        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          className="shrink-0"
          onClick={openChooseAccount}
        >
          {t("signInSignUp")}
        </Button>
      )}
    </div>
  );
}
