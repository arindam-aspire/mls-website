import type { AppLocale } from "@/src/i18n/routing";

export const APP_LOCALE_VALUES: AppLocale[] = ["en", "ar", "es", "fr"];

export type HeaderLanguageOption = {
  value: AppLocale;
  label: string;
};

export function buildHeaderLocaleOptions(
  t: (key: string) => string,
): HeaderLanguageOption[] {
  return APP_LOCALE_VALUES.map((value) => ({
    value,
    label: t(`localeNames.${value}`),
  }));
}
