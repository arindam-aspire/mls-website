import type { AppLocale } from "@/src/i18n/routing";

const INTL_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  en: "en-US",
  ar: "ar",
  es: "es",
  fr: "fr-FR",
};

export function formatListingSubmittedDate(
  value: string | null | undefined,
  locale: AppLocale,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(INTL_LOCALE_BY_APP_LOCALE[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
