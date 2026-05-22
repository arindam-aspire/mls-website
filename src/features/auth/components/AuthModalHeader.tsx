"use client";

import { ModalBackButton, ModalHeader } from "@/src/components/ui";
import Image from "next/image";
import { useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useTheme } from "@/src/providers/ThemeProvider";
import { AUTH_QUERY_KEY, AUTH_VIEW } from "./AuthModal";

type AuthModalHeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthModalHeader({
  showBack = false,
  onBack,
}: AuthModalHeaderProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? mlsLogoDark : mlsLogoLight;

  const handleBack =
    onBack ??
    (() => {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${AUTH_VIEW.chooseAccount}`);
    });

  return (
    <ModalHeader className="relative flex min-h-14 items-center justify-center !border-b-0 !px-4 !pt-4 !pb-4 sm:min-h-[4.5rem] sm:!px-6 sm:!pt-6 sm:!pb-4">
      {showBack && (
        <ModalBackButton
          aria-label={t("goBack")}
          onClick={handleBack}
        />
      )}
      <Image
        src={logoSrc}
        alt="MLS Logo"
        className="h-16 w-auto sm:h-18"
        priority
      />
    </ModalHeader>
  );
}
