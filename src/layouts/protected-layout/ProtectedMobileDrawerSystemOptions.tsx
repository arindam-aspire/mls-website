"use client";

import { Globe, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { SelectDropdown } from "@/src/components/ui/select-dropdown";
import { SettingField, SwitchField } from "@/src/components/ui/switch";
import { useProtectedMobileDrawerSystemOptions } from "@/src/layouts/protected-layout/hooks/useProtectedMobileDrawerSystemOptions";
import type { AppLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import type { ThemeMode } from "@/src/providers/ThemeProvider";

const rowDividerClass = "border-b border-secondary/10";

const sectionTitleClass =
  "pb-2 text-xs font-semibold uppercase tracking-wide text-muted";

const LANGUAGE_SELECT_WIDTH_CLASS = "w-14";
const LANGUAGE_TRIGGER_CLASS = "gap-0.5 px-1.5";

function DrawerMenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className={sectionTitleClass}>{title}</h2>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

interface DrawerLanguageRowProps {
  value: AppLocale;
  options: { value: AppLocale; label: string }[];
  onChange: (locale: AppLocale) => void;
  showDivider?: boolean;
}

function DrawerLanguageRow({
  value,
  options,
  onChange,
  showDivider = true,
}: DrawerLanguageRowProps) {
  const t = useTranslations("common");

  return (
    <SettingField
      className={cn(showDivider && rowDividerClass)}
      icon={<Globe className="size-5" aria-hidden />}
      title={t("language")}
      description={t("languageSwitchDescription")}
    >
      <SelectDropdown
        fullWidth={false}
        size="sm"
        variant="outline"
        placeholder={t("language")}
        includePlaceholderOption={false}
        listboxModal={false}
        options={options}
        value={value}
        onChange={(next) => onChange(next as AppLocale)}
        wrapperClassName={LANGUAGE_SELECT_WIDTH_CLASS}
        triggerClassName={LANGUAGE_TRIGGER_CLASS}
        aria-label={t("language")}
      />
    </SettingField>
  );
}

interface DrawerThemeRowProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  showDivider?: boolean;
}

function DrawerThemeRow({
  value,
  onChange,
  showDivider = true,
}: DrawerThemeRowProps) {
  const t = useTranslations("common");
  const isDark = value === "dark";
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <SwitchField
      className={cn(showDivider && rowDividerClass)}
      icon={<ThemeIcon className="size-5" aria-hidden />}
      title={t("darkMode")}
      description={t(isDark ? "themeSwitchToLight" : "themeSwitchToDark")}
      checked={isDark}
      onChange={(checked) => onChange(checked ? "dark" : "light")}
      aria-label={t("theme")}
      color="primary"
    />
  );
}

export function ProtectedMobileDrawerSystemOptions() {
  const t = useTranslations("common");
  const {
    locale,
    theme,
    localeOptions,
    handleLocaleChange,
    handleThemeChange,
  } = useProtectedMobileDrawerSystemOptions();

  return (
    <DrawerMenuSection title={t("mobileMenuSettings")}>
      <DrawerLanguageRow
        value={locale}
        options={localeOptions}
        onChange={handleLocaleChange}
      />
      <DrawerThemeRow
        value={theme}
        onChange={handleThemeChange}
        showDivider={false}
      />
    </DrawerMenuSection>
  );
}
