"use client";

import { ModalBackButton, ModalHeader } from "@/src/components/ui";
import Image from "next/image";
import { useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { useTheme } from "@/src/providers/ThemeProvider";

type AuthModalHeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthModalHeader({
  showBack = false,
  onBack,
}: AuthModalHeaderProps) {
  const t = useTranslations("auth");
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? mlsLogoDark : mlsLogoLight;

  return (
    <ModalHeader className="relative flex min-h-14 items-center justify-center !border-b-0 !px-4 !pt-4 !pb-4 sm:min-h-[4.5rem] sm:!px-6 sm:!pt-6 sm:!pb-4">
      {showBack && onBack != null && (
        <ModalBackButton
          aria-label={t("goBack")}
          onClick={onBack}
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
